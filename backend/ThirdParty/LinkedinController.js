
import crypto from "crypto";
import fetch from "node-fetch";
import { findOrCreateUser } from "../CRUD/UserCRUD.js";

export const linkedinAuthStart = (req, res) => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.LINKEDIN_CLIENT_ID,
    redirect_uri: process.env.LINKEDIN_CALLBACK_URL,
    scope: "openid profile email", // request OIDC scopes per LinkedIn docs
    state: crypto.randomUUID(), // or any CSRF token you store/verify
  });

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  res.redirect(authUrl);
};


export const linkedinAuthCallback = async (req, res) => {
    try{
        const {code} = req.query;

        if(!code){
            return res.status(400).send("missing code");
        }

        const body = new URLSearchParams({
            client_id: process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET,
            code,
            redirect_uri: process.env.LINKEDIN_CALLBACK_URL,
            grant_type: "authorization_code",
        });

        const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
        });

        if(!tokenRes.ok){
            const errorText = await tokenRes.text();

            console.error("Linkedin token exchange failed", tokenRes.status, errorText);
            // send error code
            return res.status(502).send(`Token exchange failed: ${errorText}`);
        }
        const { access_token } = await tokenRes.json();

        // Fetch basic profile (OpenID userinfo endpoint)
        const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        if(!profileRes.ok){
            const errorText = await profileRes.text();
            console.error("LinkedIn profile fetch failed", profileRes.status, errorText);
            return res.status(502).send(`Profile fetch failed: ${errorText}`);
        }

        const profile = await profileRes.json();
        const {
            name: profileName,
            given_name,
            family_name,
            picture,
            sub,
            email,
            email_verified
        } = profile || {};

        const name = profileName || `${given_name || ""} ${family_name || ""}`.trim() || "LinkedIn User";
        const avatar = picture || null;
        const providerId = sub;

        const user = await findOrCreateUser({
            name,
            avatar,
            provider: "linkedin",
            providerId,
            email,
            email_verified: Boolean(email_verified ?? true),
        });
        const isProd = process.env.NODE_ENV === "production";
        const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

        res.cookie("auth", user._id.toString(), {
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            maxAge: 60 * 1000 * 10,
        });
        res.redirect(frontendOrigin);
    } catch (error) {
        console.error("linkedinAuthCallback error", error);
        res.status(500).send(`Internal error during Linkedin auth: ${error.message}`);
    }
}

export const linkedinLogout = (req, res) => {
    res.clearCookie("auth", { 
        httpOnly: true, 
        sameSite: "lax", 
        secure: process.env.NODE_ENV === "production" 
    });

    return res.sendStatus(204);
};
