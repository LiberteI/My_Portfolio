import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";

import contactRoutes from "./contact/route.js";
import youtubeRoutes from "./Youtube/route.js";
import googleRoute from "./ThirdParty/GoogleRoute.js"

import mongoose from "mongoose";

const app = express();

app.use(cookieParser());

// define frontends that are trusted to send cookies
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://www.liberteii.com"
  ],
  credentials: true
}));
app.use(express.json());

app.use("/api/contact", contactRoutes);

app.use("/api/youtube", youtubeRoutes);

app.use("/auth", googleRoute);

// app.get("/api/me",async (req, res) => {
//     const userID = req.cookies.auth;
//     if(!userID){
//         return res.status(401).end();
//     }
    
//     const user = await User.findById(userID).select("name avatar");
//     if(!user){
//         return res.status(401).end();
//     }

//     res.json(user);
// })

const PORT = process.env.PORT || 8080;

// get connect to mongoDB and then start listening
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Mongo connected!");

        app.listen(PORT, () => console.log(`backend running on port ${PORT}`));
    })
    .catch(err => {
        console.error('Mongo error', err);
        process.exit(1);
    });
