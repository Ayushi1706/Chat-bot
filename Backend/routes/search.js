const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const { searchConversations } = require("../controllers/searchController");
const router = express.Router();


router.get("/", auth, searchConversations);

module.exports = router;
