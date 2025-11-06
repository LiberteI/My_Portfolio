import { useState } from "react"
import './Contact.css'
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
                {status === 'success' && <p>Thanks! I’ll get back to you soon.</p>}
                {status === 'error' && <p>Something went wrong. Please try again.</p>}

            </form>
        </div>
        
    )
}

export default Contact
