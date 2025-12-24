import { findOrCreateUser, findUser } from "./UserCRUD";

export const createUser = async (req, res) => {
    try{

        const user = await findOrCreateUser(req.body);
        res.status(201).json(user);

    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

export const getUser = async (req, res) => {
    try{
        const user = await findUser(req.body);
        res.status(200).json(user);
    } catch(error){
        return res.status(500).json({error: error.message});
    }
}