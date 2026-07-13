import Navbar from "../../Components/Navbar/Navbar"
import Contact from "./Contact"

const ContactPage = () => {
    return (
        <div className="app-container">
            <Navbar activeLabel="Contact" />
            <Contact />
        </div>
    )
}

export default ContactPage
