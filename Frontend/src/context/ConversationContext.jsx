import { createContext, useState, useContext } from "react";
import API from "../api/axios";
import toast from 'react-hot-toast';

const ConversationContext = createContext();

export const ConversationProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfMode, setPdfMode] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);


  // Get all conversations
  const getConversations = async () => {
    try {
      setConversationsLoading(true);
      const response = await API.get("/conversations");
      setConversations(response.data.conversations);
    } catch (err) {
      toast.error("Failed to load conversations");
    } finally {
      setConversationsLoading(false);
    }
  };

  // Create new conversation
  const createConversation = async () => {
    try {
      const response = await API.post("/conversations");
      const newConversation = response.data.conversation;
      setConversations([newConversation, ...conversations]);
      setActiveConversation(newConversation);
      setMessages([]);
      return newConversation;
    } catch (err) {
      toast.error("Failed to create conversation");
    }
  };

  // Load single conversation
  const loadConversation = async (conversationId) => {
    try {
      setMessagesLoading(true);
      const response = await API.get(`/conversations/${conversationId}`);
      setActiveConversation(response.data.conversation);
      setMessages(response.data.conversation.messages);
      setPdfMode(false);
      setPdfName("");
    } catch (err) {
      toast.error("Failed to load conversation");
    } finally {
      setMessagesLoading(false);
    }
  };


// Send message — accepts optional convId override
const sendMessage = async (message, convId) => {
    const id = convId || activeConversation?._id;
    if (!id) return toast.error("No active conversation");
  
    try {
      setLoading(true);
      const userMessage = { role: "user", content: message };
      setMessages((prev) => [...prev, userMessage]);
  
      const response = await API.post("/chat", {
        conversationId: id,
        message,
      });
  
      const fullReply = response.data.reply;
  
      // Add empty AI message first
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      setLoading(false);
  
      // Type out word by word
      const words = fullReply.split(" ");
      let current = "";
  
      for (let i = 0; i < words.length; i++) {
        current += (i === 0 ? "" : " ") + words[i];
        const snapshot = current;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: snapshot };
          return updated;
        });
        await new Promise((res) => setTimeout(res, 30)); // speed: lower = faster
      }
  
      // Update conversation title in sidebar
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === id
            ? { ...conv, title: response.data.conversation.title }
            : conv
        )
      );
      setActiveConversation((prev) => ({
        ...prev,
        title: response.data.conversation.title,
      }));
  
    } catch (err) {
      toast.error("Failed to send message");
      setLoading(false);
    }
  };
  // Rename conversation
const renameConversation = async (conversationId, newTitle) => {
    try {
      const response = await API.put(`/conversations/${conversationId}/rename`,{
        title: newTitle,
      });
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversationId
            ? { ...conv, title: response.data.conversation.title }
            : conv
        )
      );
      if (activeConversation?._id === conversationId) {
        setActiveConversation((prev) => ({
          ...prev,
          title: response.data.conversation.title,
        }));
      }
      toast.success("Conversation renamed!");
    } catch (err) {
      toast.error("Failed to rename conversation");
    }
  };

  // Delete conversation
  const deleteConversation = async (conversationId) => {
    try {
      await API.delete(`/conversations/${conversationId}`);
      setConversations((prev) =>
        prev.filter((conv) => conv._id !== conversationId)
      );
      if (activeConversation?._id === conversationId) {
        setActiveConversation(null);
        setMessages([]);
      }
      toast.success("Conversation deleted!");
    } catch (err) {
      toast.error("Failed to delete conversation");
    }
  };

  // Upload PDF to conversation
const uploadPDF = async (file, conversationId) => {
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("conversationId", conversationId);
  
      const response = await API.post("/pdf/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      toast.success("PDF uploaded!");
      return response.data;
    } catch (err) {
      toast.error("Failed to upload PDF");
    }
  };
  
  // Send message with PDF context
  const sendPDFMessage = async (message, convId) => {
    const id = convId || activeConversation?._id;
    if (!id) return toast.error("No active conversation");
  
    try {
      setLoading(true);
      const userMessage = { role: "user", content: message };
      setMessages((prev) => [...prev, userMessage]);
  
      const response = await API.post("/pdf/chat", {
        conversationId: id,
        message,
      });
  
      const fullReply = response.data.reply;
  
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      setLoading(false);
  
      const words = fullReply.split(" ");
      let current = "";
      for (let i = 0; i < words.length; i++) {
        current += (i === 0 ? "" : " ") + words[i];
        const snapshot = current;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: snapshot };
          return updated;
        });
        await new Promise((res) => setTimeout(res, 30));
      }
    } catch (err) {
      toast.error("Failed to send message");
      setLoading(false);
    }
  };

  return (
    <ConversationContext.Provider value={{
      conversations,
      activeConversation,
      messages,
      loading,
      getConversations,
      createConversation,
      loadConversation,
      sendMessage,
      deleteConversation,
      renameConversation,
      uploadPDF,       
      sendPDFMessage,
      pdfMode,         
      setPdfMode,      
      pdfName,         
      setPdfName, 
      setMessages,
      conversationsLoading,
      messagesLoading,
    }}>
      {children}
    </ConversationContext.Provider>
  );
};                                       

export const useConversation = () => useContext(ConversationContext);