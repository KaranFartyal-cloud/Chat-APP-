const express = require("express");

const { protect } = require("../middlewares/authMiddleware");
const {
  allmessages,
  sendMessage,
} = require("../controllers/messageController");
const router = express.Router();

router.route("/:chatId").get(protect, allmessages);
router.route("/").post(protect, sendMessage);

module.exports = router;
