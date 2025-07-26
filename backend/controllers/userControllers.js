const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const generateToken = require("../config/generateToken.js");
const express = require("express");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Enter all the Fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("user already exists");
  }

  const user = await User.create({
    // if user is not in database and all the credentials are provided then we create
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id), //we are passing this user's id , we want to send the user the token that we created (go to config then generatetoke.js)
    });
  } else {
    res.status(400);
    throw new Error("failed to create the user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  // authorize user
  const { email, password } = req.body;
  const user = await User.findOne({ email }); //find user in User collection since email is unique

  if (user && (await user.matchPassword(password))) {
    //check if this user has correct password
    //if this returned true from userModel.js file then it is authoried
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  //we are gonna use query
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }); // to get this req.user._id we have to authorize the user who is currently logged in and for that user to login and provide us the Json web token (jwt)
  res.send(users);
});

module.exports = { registerUser, authUser, allUsers }; //receiving to usereRoute.js
