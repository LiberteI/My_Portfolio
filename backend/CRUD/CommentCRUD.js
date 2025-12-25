import Comment from "../DatabaseModel/Comment.js";

// business logic

// CREATE
export const createComment = async ({ name, role, comment, author }) => {
    return await Comment.create({
        name,
        role,
        comment,
        shouldDisplay: false,
        author
    });
};

// READ all
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

    // hard delete
    return await Comment.deleteOne({_id: commentId});
};
