import { useState } from "react"

const CommentForm = () => {
    const [commentData, setCommentData] = useState({name: '', role: '', comment: ''});
    
    return (
        <div className="comment-form-container">
            <h1>Please Enter Comment Detail</h1>
            <form action="" className="comment-form">
                <input 
                    name="name"
                    type="text"
                    className="comment-input-name"
                    placeholder="Please Enter Your Name"
                    value={commentData.name}
                    onChange={handleChange}
                    required
                />

                <input 
                    name="role"
                    type="text"
                    className="comment-input-role"
                    placeholder="Please Enter Your Role With Yiming"
                    value={commentData.role}
                    onChange={handleChange}
                    required
                />

                <textarea 
                    name="comment"
                    className="comment-input-body"
                    placeholder="Enter Your Comment"
                    value={commentData.comment}
                    onChange={handleChange}
                    rows={5}
                    required
                />

                <button className="comment-button" type="submit">Submit</button>
            </form>
        </div>
    )
}