const Conversation = require("../models/Conversation");
//    → createConversation()
exports.createConversation = async (req, res) =>{
    try{
        //1. user form req user
    const userId = req.user._id;

    //2.create db enter of conversation
    const conversation = await Conversation.create({
        userId,
        title: "New Conversation",
      });

      // 3. Return new conversation
      return res.status(200).json({
        success: true,
        message: "Conversations fetched successfully",
        conversation,
    })
    } catch(error){
        console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to create conversation",
        error: error.message,
      });
    }

}
//    → getAllConversations()
exports.getAllConversations = async (req, res) => {
    try{
         // 1. Get userId from req.user._id
         const userId = req.user._id;
         // 2. Find all conversations where userId matches
         const conversation = await Conversation.find({userId})
         // 3. Sort by latest first
         .sort({ createdAt: -1 });
         // 4. Return conversations     
         return res.status(200).json({
            success: true,
            message:"fetched conversation successfully",
            conversations: conversation,
         })
    } catch(error){
        console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to get conversation",
        error: error.message,
      });
    }
}
//    → getOneConversation()
exports.getOneConversation = async (req, res) => {
    try{
        // 1. Get userId from req.user._id
        const id = req.params.id;

        //2. get conversation by id
        const conversation = await Conversation.findById(id);

        //3. if not found then return
        if(!conversation){
        return res.status(404).json({
            success: false,
            message: "Conversation not found"
          });
     }
     return res.status(200).json({
        success: true,
        message: "fetched conversation successfully", 
        conversation
      });
    } catch(error){
        console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to get conversation",
        error: error.message,
      });
    }
}

//    → deleteConversation()
exports.deleteConversation = async (req, res) => {
    try{
        //1. get id by param
        const id = req.params.id;

        //2. deletee conversation in db 
        await Conversation.findByIdAndDelete(id);

        // return res
        return res.status(200).json({
            success: true,
            message: "Converstion deleted successfully",

        })
    } catch(error){
        console.error(error);
       return res.status(500).json({
        success: false,
        message: "Failed to delete conversation",
        error: error.message,
      });
    }
}
//    → renameConversation()

exports.renameConversation = async (req, res) => {
    try{
        //1.get id by params
        const id = req.params.id;
        //2. get title from req body
        const { title } = req.body;
        //update title in db
        const updatedConversation = await Conversation.findByIdAndUpdate(
            id,
            { title },
            { new: true }
          );
        //return res
        return res.status(200).json({
            success: true,
            message: "Converstion renamed successfully",
            conversation: updatedConversation,
        })
    } catch(error){
        console.error(error);
       return res.status(500).json({
        success: false,
        message: "Failed to rename conversation",
        error: error.message,
      });
    }
}