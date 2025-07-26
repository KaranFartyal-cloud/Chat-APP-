const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");
const { accessChat, fetchChats, createGroupChat, renameGroup , addToGroup, removeFromGroup} = require("../controllers/chatControllers.js");

const router = express.Router();

router.route("/").post(protect, accessChat); //user is authorize , it has went through the protect middleware so it must have bearer token and all the payloads
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

module.exports = router;
