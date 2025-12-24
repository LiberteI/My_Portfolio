import { findUser } from "../CRUD/UserCRUD.js";

export const requireAuth = async(req, res, next) => {
    const id = req.cookies?.auth;

    if(!id){
        return res.sendStatus(401);
    }

    const user = await findUser(id);

    if(!user){
        return res.sendStatus(401);
    }

    req.user = user;

    next();
}

export const requireAdmin = async(req, res, next) => {
    req.user?.isAdmin? next() : res.sendStatus(403);
}