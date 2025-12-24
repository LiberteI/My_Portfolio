import Comment from "../DatabaseModel/Comment.js";

// CREATE
export const createComment = async ({ content, author }) => {

    let comment = await Comment.create({
        author,
        content,
        shouldDisplay: false
    });

    return comment;
};

// READ
export const findComments = async () => {
    // read comment shouldDisplay = true;
    return await Comment.find({ shouldDisplay : true })
        // replace author id with name and avatar
        .populate("author", "name avatar")
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