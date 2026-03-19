const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/authMiddleware");
const { uploadPDF } = require("../config/multer");
const { uploadPDF: uploadPDFController, chatWithPDF } = require("../controllers/pdfController");

router.post("/upload", auth, uploadPDF.single("pdf"), uploadPDFController);
router.post("/chat", auth, chatWithPDF);

module.exports = router;