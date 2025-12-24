import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";

import contactRoutes from "./contact/route.js";
import youtubeRoutes from "./Youtube/route.js";
import googleRoute from "./ThirdParty/GoogleRoute.js"

import commentRoute from "./Comment/CommentRoute.js"
import userRoute from "./User/UserRoute.js"

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

// get route from frontend
app.use("/api/contact", contactRoutes);

// get route from frontend
app.use("/api/youtube", youtubeRoutes);

// get route from frontend
app.use("/auth/google", googleRoute);

// get router from frontend
app.use("/api/Comment", commentRoute);

app.use("/api/me", userRoute);

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
