const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/authMiddleware");
const { createConversation, getAllConversations, getOneConversation, deleteConversation, renameConversation } = require("../controllers/conversationController");

router.post("/", auth, createConversation);
router.get("/", auth, getAllConversations);
router.get("/:id", auth, getOneConversation);
router.delete("/:id", auth, deleteConversation);
router.put("/:id/rename", auth, renameConversation);

module.exports = router;