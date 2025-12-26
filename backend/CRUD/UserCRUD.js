import User from "../DatabaseModel/User.js";

export const findOrCreateUser = async ({ name, avatar, provider, providerId, email }) => {
    console.log("findOrCreateUser called");

    // 1) Find an existing user by email.
    let user = await User.findOne({ email });
    console.log("existing user:", user);

    // 2) Create a new user if none exists.
    if (!user) {
        console.log("Creating new user...");
        user = await User.create({
            name,
            avatar,
            providers: [{ provider, providerId }],
            email,
            isAdmin: email === "liberteix@gmail.com",
        });
        console.log("Created user:", user);
        return user;
    }

    // 3) If the user exists, ensure this provider is recorded.
    // It checks whether the providers array contains an entry with the same provider and providerId. If none do, it returns false.
    const alreadyHasProvider = user.providers?.some(
        (p) => p.provider === provider && p.providerId === providerId
    );
    if (!alreadyHasProvider) {
        user.providers.push({ provider, providerId });
        await user.save();
    }

    return user;
};

export const findUser = async (userID) => {

    let user = await User.findById(userID).select("_id isAdmin").lean();
    
    return user;
}
