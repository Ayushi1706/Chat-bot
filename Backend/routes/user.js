// 1. Import express + create router
const express = require("express");
const router = express.Router();
// 2. Import auth middleware
const { auth } = require("../middleware/authMiddleware");

// 4. Import uploadAvatar from multer config
const { uploadAvatar } = require("../config/multer") ;

// 3. Import all functions from userController
const {
    getProfile,
    updateProfile,
    changePassword,
    deleteProfile,
    updateAvatar
} = require("../controllers/userController");

// 5. Define all routes (all protected with auth middleware)
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/avatar", auth, uploadAvatar.single("image"), updateAvatar);
router.put("/password", auth, changePassword);
router.delete("/account", auth, deleteProfile);

// 6. Export router
module.exports = router