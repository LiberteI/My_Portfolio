import { findUser } from "../CRUD/UserCRUD.js";


export const getUserID = async (req, res) => {
    try{
        const userID = req.cookies.auth;

        if(!userID){
            return res.status(401).send("no or invalid userID");
        }

        const user = await findUser(userID);

        if(!user){
            return res.status(404).send("no user found");
        }

        return res.status(200).json(user);
    } catch(error){
        console.error(error);
        return res.status(500).send("internal error in getting user");
    }
}