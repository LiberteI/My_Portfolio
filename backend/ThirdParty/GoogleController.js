import fetch from "node-fetch";
import { findOrCreateUser } from "../CRUD/UserCRUD.js";
import { OAuth2Client } from "google-auth-library";

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
    try {
        console.log(">>> googleAuthCallback HIT");

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
            console.error("Google token exchange failed", tokenRes.status, errorText);
            // send error code
            return res.status(502).send(`Token exchange failed: ${errorText}`);
        }

        console.log("Token exchange OK");

        // get data: email, google userID, name, expiration, audience
        const { id_token } = await tokenRes.json();

        // TODO:
        // 1. verify id_token *
        // 2. find/create user *
        // 3. issue JWT or session 

        console.log("id_token exists:", Boolean(id_token));

        const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        
        const ticket = await googleClient.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const googlePayLoad = ticket.getPayload();

        if (!googlePayLoad) {
            return res.status(400).send("Invalid ID token");
        }

        console.log("Google payload:", googlePayLoad);

        // extract data from token
        const { name, picture, sub, email, email_verified} = googlePayLoad;

        const user = await findOrCreateUser({
            name,
            avatar : picture,
            provider: "google",
            // subject identifier
            providerId: sub,
            email,
            email_verified
        });
        
        if(!email_verified){
            return res.status(400).send("Email not verified");
        }

        // For now, set a simple flag cookie so the client can flip the button text.
        // This is intentionally not httpOnly since we're not persisting real auth yet.
        const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
        const isProd = frontendOrigin.startsWith("https://");
        res.cookie("auth", user._id.toString() ,{
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            // persists for 10 minutes
            maxAge: 60 * 1000 * 10 
        });

        // redirect to homepage
        res.redirect(`${frontendOrigin}`);
    } catch (err) {
        console.error("googleAuthCallback error", err);
        res.status(500).send(`Internal error during Google auth: ${err.message}`);
    }
};

export const googleLogout = () => {
    res.clearCookie("auth", { 
        httpOnly: true, 
        sameSite: "lax", 
        secure: process.env.NODE_ENV === "production" 
    });

    res.sendStatus(204);
}
