const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { chats } = require("./data/data.js");
const { connectDB } = require("./config/db.js");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes.js");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

app.use(express.json()); //to accept data;
connectDB();

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound); //middlewares to handle Erros
app.use(errorHandler);

const server = app.listen(port, (req, res) => {
  //we need to assign it to server to pass it to the socket io
  console.log(`running on port ${port}`.yellow.bold);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(`logged in user ${userData._id}`);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    // console.log(`user joined room ${room}`);
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log(`chat of users is not defined`);

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
});
