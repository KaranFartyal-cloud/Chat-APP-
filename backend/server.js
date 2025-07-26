const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data.js");
const { connectDB } = require("./config/db.js");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes.js");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware.js");
const chatRoutes = require("./routes/chatRoutes.js");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); //to accept data;
connectDB();

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound); //middlewares to handle Erros
app.use(errorHandler);

app.listen(port, (req, res) => {
  console.log(`running on port ${port}`.yellow.bold);
});
