// 1. Import express
const express = require("express");

// 2. Create router
const router = express.Router();

// 3. Import signup and login from authController
const { login, signup } = require("../controllers/authController")

// 4. POST /signup → signup
router.post("/signup" , signup);

// 5. POST /login → login
router.post("/login", login);

// 6. Export router
module.exports = router;