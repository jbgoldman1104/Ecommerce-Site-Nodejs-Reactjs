const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const {
  signupRouter,
  loginRouter,
  productRouter,
  userRouter,
  commentsRouter,
  managerRouter,
  cartRouter,
  orderRouter,
  registerRouter,
} = require("./routes");
const { connectDB } = require("./db");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// Routers
app.use("/", signupRouter);
app.use("/", loginRouter);
app.use("/", productRouter);
app.use("/", userRouter);
app.use("/", commentsRouter);
app.use("/", cartRouter);
app.use("/", orderRouter);
app.use("/", registerRouter);
app.use("/admin", managerRouter);

app.use(express.static("orders"));

try {
  if (!fs.existsSync(path.join(__dirname, "../orders"))) {
    fs.mkdirSync(path.join(__dirname, "../orders"));
  }
} catch {
  console.log("Orders folder already set up.");
}

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  if (process.env.MONGODB_LOCAL) {
    connectDB();
  } else {
    const MONGO_URI = `mongodb+srv://${
      process.env.MONGO_USERNAME
    }:${encodeURIComponent(
      process.env.MONGO_PASSWORD
    )}@cluster0.kyaly.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    connectDB(MONGO_URI);
  }
  app.listen(port, () => console.log("Server is running on", port));
}

module.exports = app;
