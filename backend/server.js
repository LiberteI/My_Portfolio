import express from "express"
import cors from "cors"

const app = express();
app.use(cors());
app.use(express.json());

const isValid = ({name, email, message}) =>{
    if (!name || !email || !message){
        return false;
    } 
    if (/\d/.test(name)) {
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailRegex.test(email.trim())){
        return false;
    }
    return true;
}
app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body;

    if(!isValid({ name, email, message })){
        return res.status(400).json({error: "Input is not valid"});
    }

    console.log("Contact submission: ", { name, email, message});

    return res.status(200).json({ success: true});
})

app.listen(8080, () => console.log("backend running on port 8080"));
