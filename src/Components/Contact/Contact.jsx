import { useState } from "react"
import './Contact.css'
const Contact = () => {
    const handleSubmit = () =>{
        console.log("send to backend");
    }
    return (
        <div className="contact">
            <h1>Get In Touch</h1>
            <form className="contact-form" action="">
                <input className="contact-input-name" type="text" placeholder="Your Name"/>
                <input className="contact-input-email" type="text" placeholder="Your Email"/>
                <input className="contact-input-message" type="text" placeholder="Your Message"/>
                <button className="contact-button" onClick={handleSubmit}>Submit Message</button>
            </form>
        </div>
        
    )
}

export default Contact