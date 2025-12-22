export const googleAuthStart = (req, res) => {
    // ask google to authenticate

    // provide google with:
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        response_type: "code",
        scope: "openid email profile",
        prompt: "consent",
    });
    // create a permission request
    const googleAuthURL = "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();
    
    // build a permission request that browser must visit
    res.redirect(googleAuthURL);
}

// after passing auth start
export const googleAuthCallback = async (req, res) => {
    // ticket from google
    const { code } = req.query;

    if(!code){
        return res.status(400).send("Missing code");
    }

    // exchange code with google. done privately without showing to browser
    const body = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
    });

    // this is where auth actually completes.
    // if this succeeds, google trust server, user and sends back crytographic proof.
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });
    
    if (!tokenRes.ok) {
        const errorText = await tokenRes.text();
        
        // send error code
        return res.status(502).send(`Token exchange failed: ${errorText}`);
    }
    // get data: email, google userID, name, expiration, audience
    const { id_token } = await tokenRes.json();

    // TODO:
    // 1. verify id_token
    // 2. find/create user
    // 3. issue JWT or session

    // set cookie flag
    res.cookie("auth", user._id.toString(),{
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    // redirect to homepage
    res.redirect("https://www.liberteii.com");
};
