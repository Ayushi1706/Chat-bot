require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./config/database");

const auth = require("./routes/auth");
const user = require("./routes/user");
const conversation = require("./routes/conversation");
const chat = require("./routes/chat");
const search = require("./routes/search");
const pdf = require("./routes/pdf")

const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "AI Chatbot API is running!" });
  });


  //routes
  app.use("/api/auth", auth);
  app.use("/api/user", user);
  app.use("/api/conversations", conversation);
  app.use("/api/chat", chat);
  app.use("/api/search", search);
  app.use("/api/pdf", pdf);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  });

  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  });