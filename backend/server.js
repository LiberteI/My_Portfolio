import express from "express";
import cors from "cors";
import 'dotenv/config';

import contactRoutes from "./contact/route.js";
import youtubeRoutes from "./Youtube/route.js"

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.send("hello world");
});

app.use("/api/contact", contactRoutes);

app.use("/api/youtube", youtubeRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`backend running on port ${PORT}`));
