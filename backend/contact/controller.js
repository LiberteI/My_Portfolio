import { Resend } from 'resend';
const isValid = ({ name, email, message }) => {
    if (!name || !email || !message) {
        return false;
    }

    if (/\d/.test(name)) {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return false;
    }

    return true;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export const submitContact = async (req, res) => {
    const { name, email, message } = req.body;

    if (!isValid({ name, email, message })) {
        return res.status(400).json({ error: "Input is not valid" });
    }
    try{
        await resend.emails.send({
            from: "Contact <contact@liberteii.com>",
            to: ['liberteix@gmail.com'],
            subject: 'New Portfolio message',
            text: `From: ${name} <${email}>\n\n${message}`
        });
        return res.status(200).json({ success: true });
    } catch (err){
        console.log('Resend error', err);
        return res.status(500).json({ error: 'Failed to send'});
    }
    
};
