import { useEffect, useState } from "react"
import './Contact.css'
import emailIcon from "../../assets/email.png"
import linkedinIcon from "../../assets/linkedin.png"
const Contact = () => {
    // state set up
    const [formData, setFormData] = useState({name : '', email : '', message : ''})
    // loading / success / error
    const [status, setStatus] = useState(null);

    // update formDate
    const handleChange = (event) => {
        // get extracted json
        const {name, value} = event.target
        // keep prev values unchanged while update new key : value
        setFormData((prev) => ({...prev, [name]: value}))
    }
    
    const handleSubmit = async (event) =>{
        // stop page from loading, set flag to loading
        event.preventDefault()
        setStatus('loading')

        // try send data to backend
        try{
            // fetch is to make HTTP requests
            // wait until get the response
            const response = await fetch('http://localhost:8080/api/contact', {
                method: 'POST', // POST request
                headers: { 'Content-Type': 'application/json'}, // sending json data
                body: JSON.stringify(formData), 
                // convert { name: 'Liberte', email: 'liberte@x.com', message: 'hi' } to
                // "{\"name\":\"Liberte\",\"email\":\"liberte@x.com\",\"message\":\"hi\"}"
            })

            if(!response.ok){
                throw new Error('Request failed')
            }
            setStatus('success')
            setFormData({ name: '', email: '', message: ''})
        } catch(error){
            console.error(error)
            setStatus('error')
        }
    }

    useEffect(() => {
        if (!status || status === 'loading') {
            return;
        }
        const timer = setTimeout(() => setStatus(null), 3200);
        return () => clearTimeout(timer);
    }, [status]);

    return (
        <div id="contact" className="contact">
            <h1>Get In Touch</h1>
            <form className="contact-form" onSubmit={handleSubmit}>
                <input
                    name="name"
                    className="contact-input-name"
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    name="email"
                    className="contact-input-email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="message"
                    className="contact-input-message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                />
                <button className="contact-button" type="submit">Submit Message</button>

            </form>

            <div className="contact-alternatives">

                <div className="alternative-email">
                    <img className="contact-icon" src={emailIcon} alt="Email icon" />
                    <h2>Email</h2>
                    <a className="contact-link" href="mailto:liberteix@gmail.com">liberteix@gmail.com</a>
                    <a className="contact-link" href="mailto:yn265022@dal.ca">yn265022@dal.ca</a>
                </div>

                <div className="alternative-linkedin">
                    <img className="contact-icon" src={linkedinIcon} alt="LinkedIn icon" />
                    <h2>LinkedIn</h2>
                    <a className="contact-link" href="https://www.linkedin.com/in/yiming-yang-89a0102a0/" target="_blank" rel="noreferrer">
                        Connect on LinkedIn
                    </a>

                </div>
            </div>

            {status === 'success' && <div className="snackbar success">Thanks! I’ll get back to you soon.</div>}
            {status === 'error' && <div className="snackbar error">Something went wrong. Please try again.</div>}
        </div>
        
    )
}

export default Contact
