import express from "express";
import cors from "cors";
import 'dotenv/config';

import contactRoutes from "./contact/route.js";
import youtubeRoutes from "./Youtube/route.js";
import googleRoute from "./ThirdParty/GoogleRoute.js"

import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contact", contactRoutes);

app.use("/api/youtube", youtubeRoutes);

app.use("/auth", googleRoute);

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
