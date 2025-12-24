import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: {
      // map user's id. Points to a document in the User collection
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true
    },
    shouldDisplay: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
