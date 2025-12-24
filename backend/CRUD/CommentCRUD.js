import Comment from "../DatabaseModel/Comment.js";

// CREATE
export const createComment = async ({ name, role, comment }) => {
    return await Comment.create({
        name,
        role,
        comment,
        shouldDisplay: false
    });
};

// READ
export const findComments = async () => {
    return await Comment.find({ shouldDisplay : true })
        .sort({ createdAt: -1 });
};

// UPDATE
// given id and updates
export const editComment = async ({ commentId, updates }) => {
    // moderation (admin)
    // find item with id and apply updates
    return await Comment.findByIdAndUpdate(
        commentId,
        updates,
        // After updating, give me the updated document.
        {new: true}
    );
};

// DELETE
export const deleteComment = async (commentId) => {
    // censorship

    // find id and set display to false
    return await Comment.findByIdAndUpdate(
        commentId,
        { shouldDisplay: false},
        { new: true}
    );
};
