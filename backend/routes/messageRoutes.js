const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect } = require("../middlewares/authMiddleware");
const { allmessages , sendMessage } = require("../controllers/messageController");
const router = express.Router();

router.route("/:chatId").get(protect, allmessages);
router.route("/").post(protect, sendMessage);

module.exports = router;
