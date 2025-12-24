import Comment from "../DatabaseModel/Comment.js";

// CREATE
export const createComment = async ({ name, avatar, content, author}) => {

    let comment = await Comment.create({
        name,
        avatar,
        content,
        author
    });

    return comment;
}

// READ
export const findComment = async ({})