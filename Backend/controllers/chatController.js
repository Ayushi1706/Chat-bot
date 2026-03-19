const Groq = require("groq-sdk");
const Conversation = require("../models/Conversation");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.sendMessage = async (req, res) => {
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

    // Add user message
    conversation.messages.push({
      role: "user",
      content: message,
    });

    // Format messages for Groq
    const conversationMessages = conversation.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Send to Groq
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: conversationMessages,
    });
    const reply = response.choices[0].message.content;

    // Add reply to conversation
    conversation.messages.push({
      role: "assistant",
      content: reply,
    });

    // Auto rename if first message
    if (conversation.messages.length === 2) {
      conversation.title = message.substring(0, 50);
    }

    // Save conversation
    await conversation.save();

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      reply,
      conversation,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};