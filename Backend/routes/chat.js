const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const { sendMessage } = require("../controllers/chatController");
const router = express.Router();

router.post("/", auth, sendMessage);

module.exports = router;