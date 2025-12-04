const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter")

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database Connected");
})
.catch(err => {
    console.log(err);
});

app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

app.get("/", (req, res) => {
    res.json({message: "Hellow from the server"});
});

app.listen(process.env.PORT, () => {
    console.log("Listening on port");
})