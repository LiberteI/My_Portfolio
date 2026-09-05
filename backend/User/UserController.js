export const getUserID = (req, res) => {
    res.set("Cache-Control", "no-store");
    return res.json(req.user);
};
