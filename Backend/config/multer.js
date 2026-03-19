const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// Storage for profile images (Cloudinary)
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ai-chatbot/avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 300, height: 300, crop: "fill" }],
  },
});

const pdfStorage = multer.memoryStorage();

const uploadAvatar = multer({ storage: avatarStorage });
const uploadPDF = multer({ storage: pdfStorage });

module.exports = { uploadAvatar, uploadPDF };