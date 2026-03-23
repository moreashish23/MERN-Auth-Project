require('dotenv').config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter")

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL.replace(/\/$/, ""), 
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database Connected");
})
.catch(err => {
    console.log(err);
    process.exit(1);
});

app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

app.get("/", (req, res) => {
    res.json({message: "Hellow from the server"});
});

app.listen(process.env.PORT, () => {
    console.log("Listening on port", process.env.PORT);
})