import { randomBytes, createHash } from "node:crypto";
import Session from "../DatabaseModel/Session.js";

const hash = (token) => createHash("sha256").update(token).digest("hex");
const cookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
});

export async function createSession(res, user) {
    const token = randomBytes(32).toString("hex");
    const maxAge = 10 * 60 * 1000;
    await Session.create({ tokenHash: hash(token), user: user._id, expiresAt: new Date(Date.now() + maxAge) });
    res.cookie("auth", token, { ...cookieOptions(), maxAge });
}

export async function getSessionUser(token) {
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) return null;
    const session = await Session.findOne({ tokenHash: hash(token), expiresAt: { $gt: new Date() } })
        .populate("user", "_id isAdmin").lean();
    return session?.user ?? null;
}

export async function logoutSession(req, res) {
    const token = req.cookies?.auth;
    if (typeof token === "string") await Session.deleteOne({ tokenHash: hash(token) });
    res.clearCookie("auth", cookieOptions());
    return res.sendStatus(204);
}
