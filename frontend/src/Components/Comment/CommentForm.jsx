import { useEffect } from "react";
import { useState } from "react"

const CommentForm = () => {
    const [commentData, setCommentData] = useState({name: '', role: '', comment: '', agree: false});
    
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

    const [status, setStatus] = useState(null);

    const handleChange = (event) => {
        const {name, value, type, checked} = event.target;

        setCommentData((prev) => ({...prev, [name]: type === 'checkbox' ? checked : value}));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(!commentData.agree){
            return;
        }

        setStatus('loading');

        try{
            // send http request to backend
            const response = await fetch(`${apiBase}/api/Comment`, {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify(commentData)
            });

            if(!response.ok){
                throw new Error('Request failed');
            }

            setStatus('success');

            // reset data
            setCommentData({name: '', role: '', comment: '', agree: false});

            window.location.href = "/";

        } catch(error) {
            console.error(error);
            setStatus('error');
        }
    }

    // after status become success or error, show the status for 3.2s and reset
    useEffect(() => {
        if(!status || status === 'loading'){
            return;
        }
        const timer = setTimeout(() => setStatus(null), 3200);

        return () => clearTimeout(timer);
    }, [status])


    return (
        <div className="comment-form-container">
            <h1>Please Enter Comment Detail</h1>
            <form action="" className="comment-form" onSubmit={handleSubmit}>
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

                <label className="comment-consent">
                    <input 
                        type="checkbox"
                        name="agree"
                        checked={commentData.agree}
                        onChange={handleChange}
                        required
                    />
                    By submitting, I agree my comment and info may be displayed publicly.
                </label>

                <button className="comment-button" type="submit" disabled={!commentData.agree}>Submit</button>
            </form>
        </div>
    )
}

export default CommentForm
