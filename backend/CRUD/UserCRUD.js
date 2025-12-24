import User from "../DatabaseModel/User.js";

export const findOrCreateUser = async ({ name, avatar, provider, providerId, email }) => {
    console.log("findOrCreateUser called");
    // 1. try to find user
    let user = await User.findOne({
        "providers.provider" : provider,
        "providers.providerId" : providerId
    });

    console.log("existing user:", user);

    if(!user){
        console.log("Creating new user...");
        user = await User.create({
            name,
            avatar,
            providers: [
                { provider, providerId }
            ],
            email,
            isAdmin: email === "liberteix@gmail.com"
        });
        console.log("Created user:", user);
    }

    return user;
}