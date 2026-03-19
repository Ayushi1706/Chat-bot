import React, { useEffect, useState, useRef } from 'react'
import ThemeToggle from '../components/ThemeToggle'
import { IoMdHome, IoMdSettings, IoMdLogOut, IoMdSend } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { MdContentCopy, MdCheck, MdDriveFileRenameOutline, MdDeleteOutline, MdPictureAsPdf, MdClose } from 'react-icons/md';
import { HiDotsHorizontal, HiMenu, HiX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useConversation } from '../context/ConversationContext';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { ConversationSkeleton, MessageSkeleton } from '../components/Skeleton';

const CopyButton = ({ text, isUser }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`absolute -bottom-5 ${isUser ? "right-0" : "left-0"}
        opacity-0 group-hover:opacity-100 transition
        flex items-center gap-1 text-light-subtext dark:text-dark-subtext
        hover:text-primary text-xs`}
    >
      {copied
        ? <><MdCheck size={13} /> Copied</>
        : <><MdContentCopy size={13} /> Copy</>
      }
    </button>
  );
};

const Chat = () => {
  const { user, logout } = useAuth();
  const {
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
  } = useConversation();

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  getConversations();
}, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = () => setMenuOpenId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") return toast.error("Only PDF files allowed");
    if (file.size > 10 * 1024 * 1024) return toast.error("PDF must be under 10MB");

    let convId = activeConversation?._id;
    if (!convId) {
      const newConv = await createConversation();
      if (!newConv) return;
      convId = newConv._id;
    }

    const result = await uploadPDF(file, convId);
    if (result?.success) {
      setPdfMode(true);
      setPdfName(file.name);
      setMessages((prev) => [
        ...prev,
        { role: "user", content: `__PDF__:${file.name}` },
      ]);
    }
    e.target.value = "";
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    if (input.trim().length > 4000) return toast.error("Message too long (max 4000 chars)");
    const text = input;
    setInput("");
    if (!activeConversation) {
      const newConv = await createConversation();
      if (newConv) {
        if (pdfMode) await sendPDFMessage(text, newConv._id);
        else await sendMessage(text, newConv._id);
      }
    } else {
      if (pdfMode) await sendPDFMessage(text);
      else await sendMessage(text);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleLoadConversation = (id) => {
    loadConversation(id);
    setSidebarOpen(false);
  };

  return (
    <div className="w-full h-screen flex bg-light-bg dark:bg-dark-bg overflow-hidden">

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 1. Icon Sidebar */}
      <div className="hidden md:flex w-16 h-full flex-col items-center py-4 gap-6 bg-light-sidebar dark:bg-dark-sidebar border-r border-light-border dark:border-dark-border">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
          A
        </div>
        <IoMdHome size={22} className="text-light-subtext hover:text-primary cursor-pointer dark:text-dark-subtext transition" />
        <FaSearch size={18} className="text-light-subtext hover:text-primary cursor-pointer dark:text-dark-subtext transition" />
        <IoMdSettings size={22} className="text-light-subtext hover:text-primary cursor-pointer dark:text-dark-subtext transition" />
        <div
          onClick={() => navigate('/profile')}
          className="mt-auto w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:opacity-80 transition"
        >
          {user?.firstName?.charAt(0)}
        </div>
      </div>

      {/* 2. Conversations Sidebar */}
      <div className={`
        fixed md:relative z-30 md:z-auto
        w-72 h-full flex flex-col
        bg-light-sidebar dark:bg-dark-sidebar
        border-r border-light-border dark:border-dark-border
        p-4 gap-3
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="flex items-center justify-between md:hidden mb-1">
          <span className="text-light-text dark:text-dark-text font-semibold text-sm">Conversations</span>
          <button onClick={() => setSidebarOpen(false)}>
            <HiX size={20} className="text-light-subtext dark:text-dark-subtext" />
          </button>
        </div>

        <button
          onClick={createConversation}
          className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl py-2 font-medium flex items-center justify-center gap-2 transition"
        >
          + New Chat
        </button>

        <div className="flex items-center gap-2 bg-light-input dark:bg-dark-input rounded-xl px-3 py-2 border border-light-border dark:border-dark-border">
          <FaSearch size={14} className="text-light-subtext dark:text-dark-subtext" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-light-text dark:text-dark-text placeholder-light-subtext dark:placeholder-dark-subtext focus:outline-none text-sm"
          />
        </div>

        {/* Conversations list with skeleton */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {conversationsLoading ? (
            <ConversationSkeleton />
          ) : filteredConversations.length === 0 ? (
            <p className="text-light-subtext dark:text-dark-subtext text-sm text-center mt-8">
              {search ? "No results found" : "No conversations yet!"}
            </p>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv._id}
                className={`relative group flex items-center rounded-xl cursor-pointer text-sm transition ${
                  activeConversation?._id === conv._id
                    ? "bg-primary text-white"
                    : "text-light-text dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover"
                }`}
              >
                {renamingId === conv._id ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && renameValue.trim()) {
                        renameConversation(conv._id, renameValue.trim());
                        setRenamingId(null);
                      }
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    onBlur={() => setRenamingId(null)}
                    className="flex-1 bg-transparent px-3 py-2.5 focus:outline-none text-light-text dark:text-dark-text text-sm"
                  />
                ) : (
                  <span
                    onClick={() => handleLoadConversation(conv._id)}
                    className="flex-1 truncate px-3 py-2.5"
                  >
                    {conv.title}
                  </span>
                )}

                {renamingId !== conv._id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === conv._id ? null : conv._id);
                    }}
                    className={`pr-2 opacity-0 group-hover:opacity-100 transition ${
                      activeConversation?._id === conv._id
                        ? "text-white"
                        : "text-light-subtext dark:text-dark-subtext"
                    }`}
                  >
                    <HiDotsHorizontal size={16} />
                  </button>
                )}

                {menuOpenId === conv._id && (
                  <div className="absolute right-0 top-8 z-50 bg-light-sidebar dark:bg-dark-sidebar border border-light-border dark:border-dark-border rounded-xl shadow-lg overflow-hidden w-36">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenamingId(conv._id);
                        setRenameValue(conv.title);
                        setMenuOpenId(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-light-text dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover transition"
                    >
                      <MdDriveFileRenameOutline size={15} />
                      Rename
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv._id);
                        setMenuOpenId(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-light-hover dark:hover:bg-dark-hover transition"
                    >
                      <MdDeleteOutline size={15} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-light-border dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate('/profile')}
              className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:opacity-80 transition"
            >
              {user?.firstName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-light-text dark:text-dark-text text-sm font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-light-subtext dark:text-dark-subtext text-xs truncate">
                {user?.email}
              </p>
            </div>
            <button onClick={logout} className="text-light-subtext dark:text-dark-subtext hover:text-red-500 transition">
              <IoMdLogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Chat Area */}
      <div className="flex-1 h-full flex flex-col bg-light-bg dark:bg-dark-bg min-w-0">

        <div className="h-14 border-b border-light-border dark:border-dark-border flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-light-subtext dark:text-dark-subtext hover:text-primary transition"
            >
              <HiMenu size={22} />
            </button>
            <h1 className="text-light-text dark:text-dark-text font-semibold truncate">
              {activeConversation ? activeConversation.title : "AI Chat"}
            </h1>
          </div>
          <ThemeToggle />
        </div>

        {/* Messages with skeleton */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messagesLoading ? (
            <MessageSkeleton />
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <span className="text-4xl">🤖</span>
              <p className="text-light-subtext dark:text-dark-subtext text-sm text-center">
                {activeConversation ? "Send a message to start!" : "Create or select a conversation!"}
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="group relative pb-6 max-w-[85%] md:max-w-2xl">
                  <div className={`px-4 py-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text rounded-bl-none"
                  }`}>
                    {msg.role === "user" ? (
                      msg.content.startsWith("__PDF__:") ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <MdPictureAsPdf size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-medium">{msg.content.replace("__PDF__:", "")}</p>
                            <p className="text-xs opacity-70">PDF uploaded</p>
                          </div>
                        </div>
                      ) : (
                        msg.content
                      )
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li>{children}</li>,
                          code: ({ inline, children }) => inline
                            ? <code className="bg-black/20 dark:bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                            : <pre className="bg-black/20 dark:bg-white/10 p-3 rounded-xl text-xs font-mono overflow-x-auto mt-2 mb-2"><code>{children}</code></pre>,
                          h1: ({ children }) => <h1 className="text-base font-semibold mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-sm font-semibold mb-1">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-sm font-medium mb-1">{children}</h3>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                  <CopyButton text={msg.content} isUser={msg.role === "user"} />
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-light-input dark:bg-dark-input px-4 py-3 rounded-2xl rounded-bl-none">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-light-border dark:border-dark-border">
          {pdfMode && (
            <div className="flex items-center gap-2 mb-2 bg-primary/10 border border-primary/20 rounded-xl px-3 py-2">
              <MdPictureAsPdf size={16} className="text-primary" />
              <span className="text-xs text-primary flex-1 truncate">{pdfName}</span>
              <button
                onClick={() => { setPdfMode(false); setPdfName(""); }}
                className="text-primary hover:opacity-70 transition"
              >
                <MdClose size={14} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 bg-light-input dark:bg-dark-input rounded-2xl px-4 py-3 border border-light-border dark:border-dark-border">
            <button
              onClick={() => fileInputRef.current.click()}
              className="text-light-subtext dark:text-dark-subtext hover:text-primary transition"
              title="Upload PDF"
            >
              <MdPictureAsPdf size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handlePDFUpload}
              className="hidden"
            />
            <input
              type="text"
              placeholder={pdfMode ? "Ask about the PDF..." : "Message AI..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent text-light-text dark:text-dark-text placeholder-light-subtext dark:placeholder-dark-subtext focus:outline-none text-sm"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white disabled:opacity-50 transition"
            >
              <IoMdSend size={16} />
            </button>
          </div>
          <p className="text-center text-light-subtext dark:text-dark-subtext text-xs mt-2">
            AI can make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;