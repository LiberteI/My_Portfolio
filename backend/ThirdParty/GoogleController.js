export const googleAuthStart = (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        response_type: "code",
        scope: "openid email profile",
        prompt: "consent",
    });

    const googleAuthURL = "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();

    res.redirect(googleAuthURL);
}

export const googleAuthCallback = async (req, res) => {
    const { code } = req.query;

    if(!code){
        return res.status(400).send("Missing code");
    }

    // exchange code -> tokens
    const body = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
    });

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });

    if (!tokenRes.ok) {
        const errorText = await tokenRes.text();
        return res.status(502).send(`Token exchange failed: ${errorText}`);
    }

    const { id_token } = await tokenRes.json();

    // TODO:
    // 1. verify id_token
    // 2. find/create user
    // 3. issue JWT or session

    // temporary success redirect
    res.redirect("https://www.liberteii.com");
};
