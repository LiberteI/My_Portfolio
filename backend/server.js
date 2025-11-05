import express from "express"
import cors from "cors"

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello world");
});

app.listen(8080, () => console.log("backend running on port 8080"));
