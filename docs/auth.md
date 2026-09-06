# Authentication and sessions

Google and LinkedIn handle sign-in. After a provider confirms the user's identity, the backend creates its own temporary session to authenticate subsequent requests to the portfolio.

The browser stores a random session token in an `auth` cookie. MongoDB stores the token's hash, the associated user, and an expiration time. Protected routes validate that session before allowing access.

## What changed

Previously, the `auth` cookie contained the user's MongoDB ID:

```js
res.cookie("auth", user._id.toString())
```

The backend read that ID and looked up the user. This established that the account existed, but did not prove that the person making the request had logged in. Someone who obtained another user's ID could submit it as their cookie and be treated as that user.

A database ID identifies an account; it should not serve as a login credential. The new implementation replaces that credential with a random secret backed by a server-side session.

Existing cookies containing user IDs no longer validate. Those users must sign in again.

## 1. Sign in with a provider

The frontend redirects the browser to `/auth/google` or `/auth/linkedin`.

1. The backend redirects the browser to the provider's authorization page.
2. After sign-in, the provider redirects back to the backend callback with an authorization code.
3. The backend exchanges the code with the provider using its configured client credentials.
4. The backend retrieves and checks the user's identity information.
5. It finds or creates the local user, creates a session, and redirects back to the frontend.

The [Google controller](../backend/ThirdParty/GoogleController.js) verifies the returned ID token using `google-auth-library` and the configured client ID as the audience. The [LinkedIn controller](../backend/ThirdParty/LinkedinController.js) uses the returned access token to retrieve the profile from LinkedIn's userinfo endpoint.

Both controllers require an email and an explicitly verified email flag:

```js
if (!email || email_verified !== true) {
    return res.status(400).send("Email not verified");
}
```

This happens before finding, creating, or linking a local account. The existing [user lookup](../backend/CRUD/UserCRUD.js) matches accounts by email and records the provider and provider user ID. Checking email verification before this lookup matters because the email determines which local account is used.

## 2. Create a session

Both login controllers call `createSession()` in [session.js](../backend/Middleware/session.js).

```js
const token = randomBytes(32).toString("hex");
const maxAge = 10 * 60 * 1000;
await Session.create({
    tokenHash: hash(token),
    user: user._id,
    expiresAt: new Date(Date.now() + maxAge),
});
res.cookie("auth", token, { ...cookieOptions(), maxAge });
```

The token contains 32 random bytes, represented as 64 hexadecimal characters. The `hash()` helper computes its SHA-256 hash.

| Location | Stored information |
| --- | --- |
| Browser `auth` cookie | Original random secret token |
| MongoDB session | Token hash, user reference, expiration time |
| MongoDB user | Existing account information and admin status |

The [Session model](../backend/DatabaseModel/Session.js) defines a unique, required `tokenHash`, a required reference to a `User`, and a required `expiresAt` date.

Hashing allows the backend to check the token without storing the original secret. A stored hash cannot simply be submitted as the cookie: the server would hash it again, producing a different value. The original browser token remains a credential and must be protected.

The portfolio session token is separate from the provider's ID token or access token. Subsequent portfolio requests are authenticated through MongoDB, without asking Google or LinkedIn to verify each request.

## 3. Send the session cookie

The frontend uses requests such as:

```js
fetch(`${apiBase}/api/me`, {
    credentials: "include",
})
```

This allows the browser to attach the cookie, subject to cookie rules and the backend's CORS configuration. React does not need to read the token itself.

The backend sets these cookie options:

| Option | Current behavior |
| --- | --- |
| `httpOnly: true` | Browser JavaScript cannot read the cookie through `document.cookie`. |
| `secure` | Enabled when `NODE_ENV` is `production`, restricting cookie transmission to HTTPS. |
| `sameSite: "lax"` | Limits when the browser sends the cookie on cross-site requests. |
| `maxAge` | Expires the cookie after 10 minutes. |

These settings support session protection. The server-side session lookup establishes the user's identity.

## 4. Validate protected requests

The [authentication middleware](../backend/Middleware/auth.js) reads the `auth` cookie and calls `getSessionUser()`.

That function:

1. Rejects tokens that are not strings of exactly 64 lowercase hexadecimal characters.
2. Hashes the supplied token.
3. Finds a matching session whose expiration time is still in the future.
4. Loads the associated user's `_id` and `isAdmin` fields.

```js
const session = await Session.findOne({
    tokenHash: hash(token),
    expiresAt: { $gt: new Date() },
})
    .populate("user", "_id isAdmin")
    .lean();
```

If the cookie is missing, the token is invalid, the session has expired or been deleted, or no associated user exists, `requireAuth` returns `401 Unauthorized`.

For a valid session, it assigns the user to `req.user` and passes control to the next middleware or route handler.

Admin routes additionally use `requireAdmin`, which checks `req.user.isAdmin`. An authenticated user without admin permission receives `403 Forbidden`. Admin status comes from the user record in MongoDB, rather than a browser-supplied flag.

## 5. Expire sessions

Sessions last 10 minutes from login. Expiration is enforced in two places:

- The browser cookie has a 10-minute lifetime.
- Every backend session lookup requires `expiresAt` to be later than the current time.

The Session model also declares a MongoDB TTL index through `expires: 0` on `expiresAt` to clean up expired records. Cleanup is asynchronous; the explicit query condition rejects an expired session even if its record has not yet been removed.

There is no automatic extension on activity or session refresh in this implementation. A session created at 2:00 expires around 2:10, even if the user continues interacting with the site.

## 6. Log out

Both provider logout handlers use the shared `logoutSession()` function:

```js
const token = req.cookies?.auth;
if (typeof token === "string") {
    await Session.deleteOne({ tokenHash: hash(token) });
}
res.clearCookie("auth", cookieOptions());
return res.sendStatus(204);
```

Previously, logout only cleared the browser cookie. Now it also deletes the session in MongoDB, so a saved copy of that token stops working after successful logout.

Logout invalidates the current session. It does not invalidate every session on other devices or sign the user out of Google or LinkedIn.

The frontend currently sends `POST /auth/google/logout`. Despite its provider-specific URL, this uses the shared logout handler and can revoke a portfolio session created through either provider. The LinkedIn router also exposes `GET /auth/linkedin/logout`.

## 7. Return the current user

[`/api/me`](../backend/User/UserRoute.js) now runs through `requireAuth`. Its [controller](../backend/User/UserController.js) returns `req.user`, containing `_id` and `isAdmin`, and sets:

```http
Cache-Control: no-store
```

This instructs clients and caches not to store the identity response. Requests without a valid session receive `401` from the authentication middleware.

## Current scope and limitations

These changes improve session authentication, server-side expiry, logout revocation, and email verification before account lookup. They remain in place independently of the Currently Building feature, whose backend API and model have been removed.

This is not a complete review of the OAuth flows. In particular, the Google flow currently has no OAuth `state` check. The LinkedIn flow generates a `state` value but does not store it or validate it in the callback, so that value currently does not establish that the callback belongs to the browser's original login attempt.

This document describes the repository implementation. Live Google and LinkedIn sign-in behavior was not verified as part of writing it.


## Flow overview

### Initial sign-in

```text
Browser
   │ Sign in with Google
   ▼
Backend
   │ Redirect to Google sign-in
   ▼
Google
   │ Complete sign-in and return an authorization code
   ▼
Backend
   │ Exchange the code; verify the ID token and email_verified
   ▼
MongoDB User
   │ Find / create the user
   ▼
Backend: generate a random SECRET TOKEN
   │
   ├── SHA-256 (hash function) ──► MongoDB Session
   │                             ├── tokenHash
   │                             ├── user (user ID reference)
   │                             └── expiresAt
   │
   └── After saving the session ──► Browser
                                     └── auth cookie: original token
```

### Subsequent requests

```text
Browser
   │ GET /api/me
   │ Cookie: auth=SECRET
   ▼
requireAuth middleware
   │
   ├── Read the token and validate its format
   │      └── Missing / invalid format ──► 401 Unauthorized
   │
   ├── SHA-256(token) → tokenHash
   │
   ├── Find MongoDB Session (matching hash, not expired)
   │      └── Not found / expired ──► 401 Unauthorized
   │
   ├── Load the associated User (_id, isAdmin)
   │      └── User not found ──────► 401 Unauthorized
   │
   └── req.user = user
          │ next()
          ▼
      Controller
          │ Return req.user
          ▼
      Response
          ├── { _id, isAdmin }
          └── Cache-Control: no-store
```

### Signing in again

Signing in again reuses the existing user account and creates a new session with a new random token and a new 10-minute expiration time.

```text
Browser: sign in with Google again
   │
   ▼
Backend: complete provider authentication
   │
   ▼
MongoDB User: find the existing account
   │
   ▼
Backend: generate a new random Token B
   │
   ├── SHA-256(Token B) ──► New MongoDB Session
   │                         ├── tokenHash: SHA-256(Token B)
   │                         ├── user: same User._id
   │                         └── expiresAt: now + 10 minutes
   │
   └── After saving ──► Browser auth cookie: Token B
```

The browser replaces Token A with Token B in its `auth` cookie. Signing in again does **not** delete or expire the previous session automatically:

- If Token A has expired or its session was deleted during logout, it no longer works.
- If Token A's session is still active, Token A remains valid until it expires or its session is deleted.
- Token B authenticates a new session for the same user account.

### Session lifecycle

```text
1. SIGN IN
   │ Complete provider authentication
   ▼
2. CREATE SESSION
   │ Generate a random token
   │ Store its hash, user reference, and expiry in MongoDB
   │ Send the original token to the browser in an auth cookie
   ▼
3. AUTHENTICATE REQUESTS
   │ Read token → hash token → find unexpired session → load user
   │ Set req.user and allow the request
   │ Repeat for each protected request; activity does not extend expiry
   ▼
4. SESSION ENDS
   │
   ├── Expiration: 10 minutes have passed
   │      └── Backend rejects the session, even before database cleanup
   │
   └── Logout: delete the current session and clear the browser cookie
          │
          ▼
5. OLD TOKEN NO LONGER WORKS
   │ Protected requests with that token receive 401 Unauthorized
   │ Requests without a cookie also receive 401 Unauthorized
   ▼
6. SIGN IN AGAIN
   │ Create a new session and token for the same user
   └── Return to step 3
```
