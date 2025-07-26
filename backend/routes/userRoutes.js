const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers.js");
const { protect } = require("../middlewares/authMiddleware.js");

//in the below route it will go through protect middleware and get the jwt before accessing allusers
router.route("/").post(registerUser).get(protect, allUsers); //receiving from userController.js
router.route("/login").post(authUser); //same

module.exports = router;
