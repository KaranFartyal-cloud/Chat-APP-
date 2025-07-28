const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const { FaRegCircleQuestion } = require("react-icons/fa6");

/* asyncHandler is a middleware that wraps async functions and forwards any error to Express' error handler.

req.user contains the logged-in user (probably set by an authMiddleware after verifying JWT).

req.body.userId is the user you want to chat with.*/

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("please provide the User id");
    return res.status(400);
  }

  var isChat = await Chat.find({
    //we find if therer are chats with logged in user and given user
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password") //then we populate users inside isChat
    .populate("latestMessage"); //here chatModel referened the messageModel

  isChat = await User.populate(isChat, {
    //then we populate to the latestmessage.sender inside isChat with name, pic and email
    //we do all this so our frontend can access these fields
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    //if we find chats then we send chats
    res.send(isChat[0]);
  } else {
    var chatData = {
      //else we first config chat then make the chat below
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData); //first we create chat then we populate inside users
      const fullChat = await Chat.findOne({ id: createdChat._id }).populate(
        //when we didn't have chats in the if block we created this by populating two times here we do this simply
        "users",
        "-password"
      );

      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }) //in chat we find in the array where users have this id
      .populate("users", "-password") //populate users
      .populate("groupAdmin", "-password") //populate groupAdmin
      .populate("latestMessage") //populate latest Messages
      .sort({ updatedAt: -1 }) //sort while watching updated at field since we made timestamps to true
      .then(async (results) => {
        // console.log(results);//First console.log shows chats where latestMessage.sender is still just an ObjectId.
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).json(results); //gives an array of all chats that the logged in user has made with
        // console.log(results); //same array of chats , but now each latest message.sender is now populated iwth name email pic.
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    res.status(400).send("please fill all the details");
    return;
  }

  var users = JSON.parse(req.body.users); //since we just can't send an array directly we have to stringify that first then we have to parse it on the backend
  if (users.length < 2) {
    res.status(400).send("please provide more than 2 users");
    return;
  }

  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.find({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const upDatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true, //by default mongo db returns old data before updating but here we set that return updated data
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  // console.log(req.user);
  if (!upDatedChat) {
    res.status(400);
    throw new Error("chat not found");
  } else {
    res.json(upDatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status("400");
    throw new Error("chat not found");
  } else {
    res.status(200);
    res.json(added);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(400);
    throw new Error("couldn't find chat");
  } else {
    res.status(200);
    res.json(removed);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
