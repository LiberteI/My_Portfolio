import { findOrCreateUser } from "./UserCRUD";

export const createUser = async (req, res) => {
    try{

        const user = await findOrCreateUser(req.body);
        res.status(201).json(user);

    } catch (error) {
        res.status(error).json({error: error.message});
    }
};