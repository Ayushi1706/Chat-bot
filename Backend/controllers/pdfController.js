// const pdf = require("pdf-parse");
const Groq = require("groq-sdk");
const cloudinary = require("../config/cloudinary");
const Conversation = require("../models/Conversation");
const pdfParse = require("pdf-parse");


const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF file provided",
      });
    }

    const { conversationId } = req.body;
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "conversationId is required",
      });
    }

    // Extract text from PDF buffer
    const pdfData = await pdfParse(req.file.buffer);
    const pdfText = pdfData.text;

    // Upload to Cloudinary
    const pdfUrl = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "ai-chatbot/pdfs", resource_type: "raw" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      ).end(req.file.buffer);
    });

    // Save to conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }
    conversation.pdfUrl = pdfUrl;
    conversation.pdfText = pdfText;
    await conversation.save();

    return res.status(200).json({
      success: true,
      message: "PDF uploaded successfully",
      pdfUrl,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload PDF",
      error: error.message,
    });
  }
};

exports.chatWithPDF = async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    if (!conversationId || !message) {
      return res.status(400).json({
        success: false,
        message: "conversationId and message are required",
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (!conversation.pdfText) {
      return res.status(400).json({
        success: false,
        message: "No PDF found in this conversation",
      });
    }

    conversation.messages.push({
      role: "user",
      content: message,
    });

    const messages = [
      {
        role: "system",
        content: `You are a helpful assistant. Answer questions based on this PDF content: ${conversation.pdfText}`,
      },
      ...conversation.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages,
    });
    const reply = response.choices[0].message.content;

    conversation.messages.push({
      role: "assistant",
      content: reply,
    });

    await conversation.save();

    return res.status(200).json({
      success: true,
      message: "Chat with PDF successful",
      reply,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to chat with PDF",
      error: error.message,
    });
  }
};