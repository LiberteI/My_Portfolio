import Comment from "../DatabaseModel/Comment.js";

// CREATE
export const createComment = async ({ content, author, shouldDisplay}) => {

    let comment = await Comment.create({
        author,
        content,
        shouldDisplay
    });

    return comment;
}

// READ
export const findComment = async () => {
    // read comment shouldDisplay = true;
}

// UPDATE
export const editComment = async () => {
    // edit comment content or shouldDisplay
}

// DELETE
export const deleteComment = async () => {
    // censorship
}