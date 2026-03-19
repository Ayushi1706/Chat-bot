const Conversation = require("../models/Conversation");

exports.searchConversations = async (req, res) => {
    try{
         // 1. Get keyword from req.query.q
         const keyword = req.query.q;
         // 2. Validate keyword
         if(!keyword){
            return res.status(400).json({
                success: false,
                message: "KeyWord is required",
              });
         }
         // 3. Search MongoDB conversations by title
         const conversations = await Conversation.find({
            userId: req.user._id,
            title: { $regex: keyword, $options: "i" } // i = case insensitive
          });
        
         // 4. Return matching conversations
         return res.status(200).json({
            success: true,
            message: "Conversations found",
            conversations,
          });
    } catch(error){console.error(error);
        return res.status(500).json({
          success: false,
          message: "Failed to search converastion",
          error: error.message,
        });
      }
}