const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const protect = asyncHandler(async (req, res, next) => {
  //user must have logged in
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer") //we get the hold of the token from the logged in uuser and provide it while searching
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decode token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET); //decode it and gives the decoded payload (which is user info like id name email) if its valid jwt
      req.user = await User.findById(decoded.id).select("-password"); ///we store this user in req.user except the password field for security reasons
      next(); //perform the next operation which is get to allusers who is not the useer himself
    } catch (error) {
      res.status(401);
      throw new Error("not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("no token ");
  }
});

module.exports = { protect };
