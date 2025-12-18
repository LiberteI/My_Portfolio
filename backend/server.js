import express from "express";
import cors from "cors";
import 'dotenv/config';

import contactRoutes from "./contact/route.js";
import youtubeRoutes from "./Youtube/route.js"

import mongoose from "mongoose";


const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.send("hello world");
});

app.use("/api/contact", contactRoutes);

app.use("/api/youtube", youtubeRoutes);

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Mongo connected!");

        app.listen(PORT, () => console.log(`backend running on port ${PORT}`));
    })
    .catch(err => {
        console.error('Mongo error', err);
        process.exit(1);
    });
