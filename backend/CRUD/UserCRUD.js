import User from "../DatabaseModel/User.js";

export const findOrCreateUser = async ({ name, avatar, provider, providerId }) => {
    // 1. try to find user
    let user = await User.findOne({
        "providers.provider" : provider,
        "providers.providerId" : providerId
    });

    if(!user){
        user = await User.create({
            name,
            avatar,
            providers: [
                { provider, providerId }
            ]
        });
    }

    return user;
}