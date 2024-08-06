const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const userRouter = require("./routes/user.routes");
const shortRouter = require("./routes/post.routes");

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/shorts", shortRouter);

module.exports = app;
