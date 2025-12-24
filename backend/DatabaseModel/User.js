import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: 
        {
            type: String,
            required: true,
        },

    avatar: String,

    providers: 
    [ // array of provider
        {
            provider: {
                        type: String,
                        enum: ["google", "github", "linkedin"],
                        required: true,
            },
            providerId: {
                        type: String,
                        required: true,
            },
        },
    ],
    email: 
        {
            type: String,
            required: true,
            unique: true
        },
    isAdmin: 
        {
            type: Boolean,
            default: false
        }
  },
  { timestamps: true }
);

// In the providers array, the combination of provider + providerId must be unique across all users.
userSchema.index(
  { "providers.provider": 1, "providers.providerId": 1 },
  { unique: true }
);

export default mongoose.model("User", userSchema);

/*
    User.create()
    User.find()
    User.findOne()
    User.findById()
    User.findByIdAndUpdate()
    User.deleteOne()
*/