import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import api from "../utils/api";
import { toast } from "react-toastify";
import { Send, User, MessageSquare, Search, CheckCheck, MoreHorizontal, Paperclip, Image, FileText, MapPin, X, Trash2, Info, Reply, Smile, Download, Forward, Pin, Bookmark, ChevronDown, Clock, Check, ChevronRight, Phone, Video, Ban, Flag, BellOff, Palette, Camera } from "lucide-react";
import CallOverlay from "../components/CallOverlay";
const Messaging = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { messages, sendMessage, setMessages, typingStatus, sendTyping, deleteMessage, editMessage, pinMessage, reactMessage, callUser } = useSocket();
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [contacts, setContacts] = useState([]);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null); // messageId
  const [forwardingMessage, setForwardingMessage] = useState(null);
  const [showInfoMessage, setShowInfoMessage] = useState(null);
  const [showMediaSidebar, setShowMediaSidebar] = useState(false);
  const [mutedContacts, setMutedContacts] = useState([]);
  const [mediaData, setMediaData] = useState({ media: [], docs: [], links: [] });
  const [activeTab, setActiveTab] = useState("media");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (user?._id) fetchContacts();
    if (location.state?.initialContact) {
      const contact = location.state.initialContact;
      setActiveChat(contact);
      setContacts(prev => {
        const exists = prev.find(c => c._id === contact._id);
        if (!exists) return [contact, ...prev];
        return prev;
      });
    }
  }, [location.state, user?._id]);
  useEffect(() => {
    if (activeChat) {
      fetchChatHistory(activeChat._id);
      fetchMedia(activeChat._id);
    }
  }, [activeChat]);
  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages, typingStatus]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const fetchContacts = async () => {
    try {
      const res = await api.get("/chat/contacts");
      setContacts(res.data.data);
      const userRes = await api.get("/auth/me");
      if (userRes.data.success) {
        setMutedContacts(userRes.data.data.mutedUsers || []);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchMedia = async (userId) => {
    try {
      const res = await api.get(`/chat/${userId}/media`);
      setMediaData(res.data.data);
    } catch (err) {
      console.error("Failed to fetch media:", err);
    }
  };
  const fetchChatHistory = async (userId) => {
    try {
      const res = await api.get(`/chat/${userId}`);
      setMessages(res.data.data.map(m => ({
        _id: m._id,
        senderId: m.sender,
        recipientId: m.recipient,
        content: m.content,
        type: m.type || "text",
        fileUrl: m.fileUrl,
        location: m.location,
        isEdited: m.isEdited,
        isPinned: m.isPinned,
        createdAt: m.createdAt
      })));
    } catch (err) {
      console.error(err);
    }
  };
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (activeChat) {
      sendTyping(activeChat._id, true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(activeChat._id, false);
      }, 2000);
    }
  };
  const handleSend = (e) => {
    e.preventDefault();
    if (editingMessageId) {
      handleUpdateMessage();
      return;
    }
    const messageData = {
      senderId: user.id || user._id,
      recipientId: activeChat._id,
      content: newMessage,
      senderName: user.name,
      replyTo: replyingTo?._id
    };
    sendMessage(messageData);
    setNewMessage("");
    setReplyingTo(null);
    sendTyping(activeChat._id, false);
  };
  const handleUpdateMessage = async () => {
    try {
      const res = await api.put(`/chat/message/${editingMessageId}`, {
        content: newMessage
      });
      if (res.data.success) {
        editMessage(editingMessageId, newMessage, activeChat._id);
        toast.success("Message updated");
        setEditingMessageId(null);
        setNewMessage("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update message");
    }
  };
  const handleClearChat = async () => {
    if (!window.confirm("Are you sure you want to clear this chat? This cannot be undone.")) return;
    try {
      const res = await api.delete(`/chat/${activeChat._id}/clear`);
      if (res.data.success) {
        setMessages([]);
        toast.success("Chat history cleared");
        setShowHeaderMenu(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear chat");
    }
  };
  const handleMuteToggle = async () => {
    try {
      const res = await api.post(`/chat/${activeChat._id}/mute`, {});
      if (res.data.success) {
        setMutedContacts(prev => 
          res.data.isMuted 
            ? [...prev, activeChat._id] 
            : prev.filter(id => id !== activeChat._id)
        );
        toast.success(res.data.isMuted ? "Notifications muted" : "Notifications unmuted");
        setShowHeaderMenu(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update mute status");
    }
  };
  const handleBlockUser = async () => {
    if (!window.confirm(`Are you sure you want to block ${activeChat.name}?`)) return;
    try {
      const res = await api.post(`/chat/${activeChat._id}/block`, {});
      if (res.data.success) {
        toast.success(res.data.isBlocked ? "User blocked" : "User unblocked");
        setShowHeaderMenu(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update block status");
    }
  };
  const handleReportUser = async () => {
    const reason = window.prompt("Why are you reporting this user?");
    if (!reason) return;
    try {
      const res = await api.post(`/chat/${activeChat._id}/report`, { reason });
      if (res.data.success) {
        toast.success("User reported. Our team will review this message.");
        setShowHeaderMenu(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to report user");
    }
  };
  const handleFileSelect = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("chatAttachment", file);
    try {
      toast.info(`Uploading ${type}...`);
      const res = await api.post("/upload/chat-attachment", formData, {
        headers: { 
          "Content-Type": "multipart/form-data"
        }
      });
      const messageData = {
        senderId: user.id || user._id,
        recipientId: activeChat._id,
        content: `Sent a ${type}`,
        type: type,
        fileUrl: res.data.data,
        senderName: user.name
      };
      sendMessage(messageData);
      setShowAttachmentMenu(false);
      toast.success(`${type} sent!`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to upload ${type}`);
    }
  };
  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation is not supported by your browser");
    }
    toast.info("Getting your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const messageData = {
          senderId: user.id || user._id,
          recipientId: activeChat._id,
          content: "Shared a location",
          type: "location",
          location: {
            lat: latitude,
            lng: longitude,
            address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
          },
          senderName: user.name
        };
        sendMessage(messageData);
        setShowAttachmentMenu(false);
        toast.success("Location shared!");
      },
      (error) => {
        console.error(error);
        toast.error("Failed to get your location");
      }
    );
  };
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to unsend this message?")) return;
    try {
      const res = await api.delete(`/chat/message/${messageId}`);
      if (res.data.success) {
        deleteMessage(messageId, res.data.recipientId);
        toast.success("Message unsent");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete message");
    } finally {
      setMenuOpenId(null);
    }
  };
  const handleDeleteForMe = (messageId) => {
    setMessages(prev => prev.filter(m => m._id !== messageId));
    setMenuOpenId(null);
    toast.success("Message removed for you");
  };
  const handlePinMessage = async (msg) => {
    try {
      const res = await api.patch(`/chat/message/${msg._id}/pin`, {});
      if (res.data.success) {
        pinMessage(msg._id, !msg.isPinned, activeChat._id);
        toast.success(msg.isPinned ? "Message unpinned" : "Message pinned");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to pin message");
    } finally {
      setMenuOpenId(null);
    }
  };
  const handleAction = (action, msg) => {
    if (action === "Edit") {
      setEditingMessageId(msg._id);
      setNewMessage(msg.content);
      setMenuOpenId(null);
      return;
    }
    if (action === "Pin") {
      handlePinMessage(msg);
      return;
    }
    if (action === "Reply") {
      setReplyingTo(msg);
      setMenuOpenId(null);
      return;
    }
    if (action === "React") {
      setShowEmojiPicker(msg._id);
      setMenuOpenId(null);
      return;
    }
    if (action === "Forward") {
      setForwardingMessage(msg);
      setMenuOpenId(null);
      return;
    }
    if (action === "Message info") {
      setShowInfoMessage(msg);
      setMenuOpenId(null);
      return;
    }
    if (action === "Keep") {
      toast.success("Message saved to Keep!");
      setMenuOpenId(null);
      return;
    }
    toast.info(`${action} is coming soon!`);
    setMenuOpenId(null);
  };
  const handleForwardMessage = (recipient) => {
    if (!forwardingMessage) return;
    const messageData = {
      senderId: user.id || user._id,
      recipientId: recipient._id,
      content: forwardingMessage.content,
      type: forwardingMessage.type,
      fileUrl: forwardingMessage.fileUrl,
      location: forwardingMessage.location,
      senderName: user.name
    };
    sendMessage(messageData);
    setForwardingMessage(null);
    toast.success(`Message forwarded to ${recipient.name}`);
  };
  const handleAddReaction = async (msgId, emoji) => {
    try {
      const res = await api.post(`/chat/message/${msgId}/react`, { emoji });
      if (res.data.success) {
        setMessages(prev => prev.map(m => m._id === msgId ? { ...m, reactions: res.data.data } : m));
        reactMessage(msgId, res.data.data, activeChat._id);
        setShowEmojiPicker(null);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-80px)] -m-8 relative">
      <aside className={`absolute inset-0 md:relative md:flex md:w-96 border-r border-slate-200 dark:border-slate-600 flex-col bg-slate-50 dark:bg-[#0F172A] shrink-0 transition-all duration-300 z-20 ${
        activeChat ? "hidden md:flex" : "flex w-full"
      }`}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-600 bg-white dark:bg-[#1E293B] transition-colors">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-base transition font-black text-slate-900 dark:text-slate-200 placeholder:text-slate-400"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <div
                key={contact._id}
                onClick={() => setActiveChat(contact)}
                className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1E293B] transition border-l-4 ${
                  activeChat?._id === contact._id ? "bg-slate-100 dark:bg-[#1E293B] border-indigo-600 dark:border-indigo-500 shadow-sm" : "border-transparent"
                }`}
              >
                <div className="relative">
                  <div className="h-14 w-14 bg-white dark:bg-[#1E293B] text-slate-900 dark:text-[#E2E8F0] rounded-2xl flex items-center justify-center font-black text-xl shadow-inner uppercase border border-slate-200 dark:border-white/5 transition-colors">
                    {contact.name[0]}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-500 border-2 border-slate-50 dark:border-[#0F172A] rounded-full transition-colors"></div>
                </div>
                 <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-black text-slate-900 dark:text-slate-200 truncate tracking-tight text-lg transition-colors">{contact.name}</h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase">10:45 AM</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.15em] transition-colors">{contact.role}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="p-6 bg-white dark:bg-[#1E293B] shadow-lg dark:shadow-black/20 rounded-3xl mb-6 inline-block border border-slate-100 dark:border-slate-600 transition-colors">
                <MessageSquare size={48} className="text-indigo-600 dark:text-indigo-400 opacity-20" />
              </div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest opacity-60">No Messages</p>
            </div>
          )}
        </div>
      </aside>
      <main className={`flex-1 flex flex-col bg-white dark:bg-[#0F172A] min-w-0 transition-all duration-300 ${
        activeChat ? "flex w-full absolute inset-0 md:relative" : "hidden md:flex"
      }`}>
        {activeChat ? (
          <>
            <header className="px-4 md:px-8 py-4 md:py-5 border-b border-slate-200 dark:border-slate-600 flex items-center justify-between bg-white dark:bg-[#1E293B] z-10 shadow-sm relative transition-colors">
              <div className="flex items-center gap-3 md:gap-4 flex-1">
                {!showSearch ? (
                  <>
                    <button 
                      onClick={() => setActiveChat(null)}
                      className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition"
                    >
                      <ChevronRight className="rotate-180" size={24} />
                    </button>
                    <div className="h-10 w-10 md:h-14 md:w-14 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black text-lg md:text-xl uppercase shadow-lg dark:shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] transition-all">
                      {activeChat.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black text-slate-900 dark:text-[#E2E8F0] tracking-tight text-base md:text-xl truncate transition-colors">{activeChat.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                        <p className="text-[10px] text-green-600 dark:text-green-400 font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-colors">Online</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#0F172A] px-4 py-2.5 rounded-2xl w-full mr-4 border border-slate-200 dark:border-slate-600 animate-in slide-in-from-left-4 duration-200 transition-colors">
                    <Search size={18} className="text-slate-500 dark:text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search in conversation..."
                      className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900 dark:text-slate-200 w-full placeholder:text-slate-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                    />
                    <button 
                      onClick={() => { setShowSearch(false); setSearchTerm(""); }}
                      className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition text-slate-400 dark:text-slate-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
               <div className="flex items-center gap-1 md:gap-2">
                 <button 
                  onClick={() => callUser(activeChat._id, 'audio')}
                  className="p-2 md:p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <Phone size={20} className="md:w-6 md:h-6" />
                </button>
                <button 
                  onClick={() => callUser(activeChat._id, 'video')}
                  className="p-2 md:p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition text-slate-400 dark:text-slate-500 hover:text-green-600 dark:hover:text-green-400"
                >
                  <Video size={20} className="md:w-6 md:h-6" />
                </button>
                <button 
                  onClick={() => setShowHeaderMenu(!showHeaderMenu)}
                  className={`p-2 md:p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition ${showHeaderMenu ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  <MoreHorizontal size={18} className="md:w-5 md:h-5" />
                </button>
                {showHeaderMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setShowHeaderMenu(false)}
                    ></div>
                    <div className="absolute right-8 top-20 w-72 bg-white dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-600 rounded-3xl shadow-2xl z-30 py-3 animate-in fade-in zoom-in duration-200 origin-top-right transition-colors">
                      <div className="px-4 py-2 mb-2 border-b border-slate-100 dark:border-slate-700/50">
                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Conversation Options</p>
                      </div>
                      <button 
                        onClick={() => { setShowMediaSidebar(!showMediaSidebar); setShowHeaderMenu(false); }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-700/50 transition text-left group"
                      >
                        <div className="p-2 bg-violet-500/20 text-violet-600 dark:text-violet-400 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition">
                          <Image size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Media, Links, and Docs</span>
                      </button>
                      <button 
                        onClick={() => { setShowSearch(true); setShowHeaderMenu(false); }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-700/50 transition text-left group"
                      >
                        <div className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition">
                          <Search size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Message Search</span>
                      </button>
                      <div className="h-px bg-slate-700/50 my-2 mx-4"></div>
                      <button 
                        onClick={handleMuteToggle}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-700/50 transition text-left group"
                      >
                        <div className={`p-2 rounded-xl transition ${mutedContacts.includes(activeChat._id) ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 dark:group-hover:text-white'}`}>
                          <BellOff size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          {mutedContacts.includes(activeChat._id) ? "Unmute Notifications" : "Mute Notifications"}
                        </span>
                      </button>
                      <div className="h-px bg-slate-700/50 my-2 mx-4"></div>
                      <button 
                        onClick={handleClearChat}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-500/10 transition text-left group"
                      >
                        <div className="p-2 bg-red-500/20 text-red-400 rounded-xl group-hover:bg-red-600 group-hover:text-white transition">
                          <Trash2 size={16} />
                        </div>
                        <span className="text-sm font-bold text-red-400">Clear Chat</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </header>
            <div className="flex-1 px-4 md:px-8 py-4 md:py-6 overflow-y-auto space-y-4 md:space-y-6 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
              {messages.filter(m => 
                ((m.senderId === (user.id || user._id) && m.recipientId === activeChat._id) || 
                (m.senderId === activeChat._id && m.recipientId === (user.id || user._id))) &&
                (!searchTerm || (m.content && m.content.toLowerCase().includes(searchTerm.toLowerCase())))
              ).map((msg, idx) => (
                <div
                  key={msg._id || idx}
                  className={`flex group ${msg.senderId === (user.id || user._id) ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex flex-col max-w-[80%] ${msg.senderId === (user.id || user._id) ? "items-end" : "items-start"}`}>
                    <div
                      className={`px-6 py-4 rounded-[1.5rem] shadow-lg w-fit break-words relative transition-all duration-300 ${
                        msg.senderId === (user.id || user._id)
                          ? "bg-white dark:bg-[#1E293B] text-slate-900 dark:text-[#E2E8F0] rounded-tr-none border border-slate-200 dark:border-slate-600/50 hover:border-indigo-200 dark:hover:border-slate-500/50 shadow-slate-200 dark:shadow-black/40"
                          : "bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-tl-none shadow-lg dark:shadow-indigo-500/20"
                      }`}
                    >
                      {msg.isPinned && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 p-1 rounded-full shadow-md z-10 animate-in zoom-in duration-300">
                          <Pin size={10} fill="currentColor" />
                        </div>
                      )}
                      {msg.replyTo && (
                        <div className={`mb-3 p-3 rounded-lg border-l-4 text-sm transition-colors ${
                          msg.senderId === (user.id || user._id) ? "bg-slate-50 dark:bg-[#0F172A] border-indigo-600/30 dark:border-indigo-500/30" : "bg-white/10 border-white/30"
                        }`}>
                          <p className="font-black opacity-60 uppercase tracking-widest text-xs mb-1.5 transition-colors">Replying to</p>
                          <p className="line-clamp-2 opacity-90 italic">
                            {typeof msg.replyTo === 'object' ? msg.replyTo.content : "Original message..."}
                          </p>
                        </div>
                      )}
                       {msg.type === "text" && (
                        <p className="text-base font-black leading-relaxed">{msg.content}</p>
                      )}
                      {msg.type === "image" && (
                        <div className="space-y-2">
                          <img 
                            src={msg.fileUrl} 
                            alt="Attachment" 
                            className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition"
                            onClick={() => window.open(msg.fileUrl, '_blank')}
                          />
                        </div>
                      )}
                      {msg.type === "file" && (
                         <a 
                          href={msg.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 group/file"
                         >
                          <div className={`p-3 rounded-xl ${msg.senderId === (user.id || user._id) ? "bg-slate-700" : "bg-white/10"}`}>
                            <FileText size={28} className={msg.senderId === (user.id || user._id) ? "text-gray-600" : "text-white"} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black truncate max-w-[180px]">Document</p>
                             <p className={`text-xs uppercase font-black tracking-widest mt-1 transition-colors ${msg.senderId === (user.id || user._id) ? "text-slate-500 dark:text-slate-400" : "text-indigo-100"}`}>Click to view</p>
                          </div>
                        </a>
                      )}
                      {msg.type === "location" && (
                         <a 
                          href={`https://www.google.com/maps?q=${msg.location.lat},${msg.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col gap-3 group/loc"
                         >
                          <div className="flex items-center gap-4">
                             <div className={`p-3 rounded-xl ${msg.senderId === (user.id || user._id) ? "bg-slate-700" : "bg-white/10"}`}>
                              <MapPin size={28} className="text-red-500" />
                            </div>
                            <div>
                              <p className="text-sm font-black">Shared Location</p>
                               <p className={`text-xs uppercase font-black tracking-widest mt-1 transition-colors ${msg.senderId === (user.id || user._id) ? "text-slate-500 dark:text-slate-400" : "text-indigo-100"}`}>View on Maps</p>
                            </div>
                          </div>
                          <p className="text-xs font-black opacity-60 italic">{msg.location.address}</p>
                        </a>
                      )}
                    </div>
                     <div className="flex items-center gap-3 mt-2.5">
                      <span className="text-xs text-slate-500 font-black uppercase tracking-[0.2em] flex items-center gap-2 order-2">
                        {msg.isEdited && <span className="text-amber-500 font-black">Edited •</span>}
                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {msg.senderId === (user.id || user._id) && msg._id && (
                          <CheckCheck size={16} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
                        )}
                      </span>
                      <div className="relative order-1 ml-2 mr-2">
                        <button 
                          onClick={() => setMenuOpenId(menuOpenId === msg._id ? null : msg._id)}
                          className={`p-1 transition-all rounded-lg hover:bg-slate-700 ${
                            menuOpenId === msg._id ? "text-slate-200 bg-slate-700" : "text-slate-400 opacity-100"
                          }`}
                        >
                          <MoreHorizontal size={14} />
                        </button>
                        {menuOpenId === msg._id && (
                          <div className={`absolute w-52 bg-white dark:bg-[#1E293B] shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-600 py-2 z-[200] animate-in fade-in zoom-in duration-200 transition-colors ${
                            msg.senderId === (user.id || user._id) ? "right-0" : "left-0"
                          } ${
                            idx > messages.length / 2 ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"
                          } ${
                            msg.senderId === (user.id || user._id) ? (idx > messages.length / 2 ? "origin-bottom-right" : "origin-top-right") : (idx > messages.length / 2 ? "origin-bottom-left" : "origin-top-left")
                          }`}>
                            <button onClick={() => handleAction("Message info", msg)} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300">
                              <Info size={16} className="text-slate-500 dark:text-slate-400" />
                              <span className="text-sm font-medium">Message info</span>
                            </button>
                            {msg.senderId === (user.id || user._id) && msg.type === "text" && (
                              <button onClick={() => handleAction("Edit", msg)} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300">
                                <FileText size={16} className="text-slate-500 dark:text-slate-400" />
                                <span className="text-sm font-medium">Edit</span>
                              </button>
                            )}
                            <button onClick={() => handleAction("Reply", msg)} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300">
                              <Reply size={16} className="text-slate-500 dark:text-slate-400" />
                              <span className="text-sm font-medium">Reply</span>
                            </button>
                            <button onClick={() => handleAction("React", msg)} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300">
                              <Smile size={16} className="text-slate-500 dark:text-slate-400" />
                              <span className="text-sm font-medium">React</span>
                            </button>
                            {msg.type !== "text" && (
                              <button onClick={() => window.open(msg.fileUrl, '_blank')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-700 transition text-slate-300">
                                <Download size={16} className="text-slate-400" />
                                <span className="text-sm font-medium">Download</span>
                              </button>
                            )}
                            <button onClick={() => handleAction("Forward", msg)} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300">
                              <Forward size={16} className="text-slate-500 dark:text-slate-400" />
                              <span className="text-sm font-medium">Forward</span>
                            </button>
                            <button onClick={() => handleAction("Pin", msg)} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300">
                              <Pin size={16} className={msg.isPinned ? "text-yellow-600 dark:text-yellow-500" : "text-slate-500 dark:text-gray-400"} />
                              <span className="text-sm font-medium">{msg.isPinned ? "Unpin" : "Pin"}</span>
                            </button>
                            <button onClick={() => handleAction("Keep", msg)} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300">
                              <Bookmark size={16} className="text-slate-500 dark:text-slate-400" />
                              <span className="text-sm font-medium">Keep</span>
                            </button>
                            <div className="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-4"></div>
                            {msg.senderId === (user.id || user._id) && (
                              <button 
                                onClick={() => handleDeleteMessage(msg._id)}
                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-500/10 transition text-red-400"
                              >
                                <Trash2 size={16} />
                                <span className="text-sm font-medium">Delete for everyone</span>
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteForMe(msg._id)}
                              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-500/10 transition text-red-400"
                            >
                              <Trash2 size={16} />
                              <span className="text-sm font-medium">Delete for me</span>
                            </button>
                          </div>
                        )}
                      </div>
                      {msg.reactions && msg.reactions.length > 0 && (                         <div className="flex flex-wrap gap-1.5 mt-2">
                          {Array.from(new Set(msg.reactions.map(r => r.emoji))).map(emoji => (
                            <button 
                              key={emoji}
                              onClick={() => handleAddReaction(msg._id, emoji)}
                              className={`px-2 py-1 rounded-full text-xs flex items-center gap-1.5 shadow-sm border transition ${
                               msg.reactions.some(r => r.user === user.id && r.emoji === emoji)
                                ? "bg-indigo-500/20 border-indigo-600/30 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300"
                                : "bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              <span>{emoji}</span>
                              <span className="font-black">{msg.reactions.filter(r => r.emoji === emoji).length}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {showEmojiPicker === msg._id && (
                        <div className="absolute z-[300] bottom-full mb-2 left-0 bg-white dark:bg-[#1E293B] shadow-2xl rounded-2xl p-2 border border-slate-200 dark:border-slate-600 flex gap-2 animate-in zoom-in duration-200 transition-colors">
                          {["👍", "❤️", "😂", "😮", "😢", "🔥"].map(emoji => (
                            <button 
                              key={emoji}
                              onClick={() => handleAddReaction(msg._id, emoji)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-lg transition"
                            >
                              {emoji}
                            </button>
                          ))}
                          <button onClick={() => setShowEmojiPicker(null)} className="w-8 h-8 flex items-center justify-center hover:bg-red-500/10 text-red-400 rounded-lg transition">
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {typingStatus[activeChat._id] && (
                <div className="flex justify-start transition-all">
                  <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-600 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 transition-colors">
                    <div className="flex space-x-1.5">
                      <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <footer className="p-4 md:p-6 bg-white dark:bg-[#1E293B] border-t border-slate-200 dark:border-slate-600 relative transition-colors">
              {replyingTo && (
                <div className="absolute bottom-full left-0 w-full p-4 bg-slate-100 dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-600 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300 transition-colors">
                  <div className="flex items-center gap-3 border-l-4 border-indigo-500 pl-4">
                    <Reply size={16} className="text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 transition-colors">Replying to {replyingTo.senderId === user.id ? "yourself" : replyingTo.senderName || "Contact"}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 italic transition-colors">{replyingTo.content}</p>
                    </div>
                  </div>
                  <button onClick={() => setReplyingTo(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 dark:text-slate-500 transition">
                    <X size={16} />
                  </button>
                </div>
              )}
              {showAttachmentMenu && (
                <div className="absolute bottom-28 left-10 bg-white dark:bg-[#1E293B] shadow-2xl rounded-[2rem] border border-slate-200 dark:border-slate-600 p-4 flex flex-col gap-2 z-20 animate-in slide-in-from-bottom-4 duration-300 transition-colors">
                  <button 
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl transition group w-48 text-left transition-colors"
                  >
                    <div className="h-10 w-10 bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                      <Image size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-slate-200 leading-none transition-colors">Photos</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-1 transition-colors">Image or Video</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl transition group w-48 text-left transition-colors"
                  >
                    <div className="h-10 w-10 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-slate-200 leading-none transition-colors">Document</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-1 transition-colors">PDF, DOC, etc.</p>
                    </div>
                  </button>
                  <button 
                    onClick={handleShareLocation}
                    className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl transition group w-48 text-left transition-colors"
                  >
                    <div className="h-10 w-10 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-slate-200 leading-none transition-colors">Location</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-1 transition-colors">Share where you are</p>
                    </div>
                  </button>
                </div>
              )}
              <div className="hidden">
                <input 
                  type="file" 
                  ref={imageInputRef} 
                  accept="image/*" 
                  onChange={(e) => handleFileSelect(e, 'image')} 
                />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept=".pdf,.doc,.docx,.zip,.txt" 
                  onChange={(e) => handleFileSelect(e, 'file')} 
                />
              </div>
              <form onSubmit={handleSend} className="flex gap-4 max-w-5xl mx-auto items-center">
                <button
                  type="button"
                  onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    showAttachmentMenu ? "bg-cyan-400 text-slate-900" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  <Paperclip size={24} className={showAttachmentMenu ? "rotate-45 transition-transform" : "transition-transform"} />
                </button>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="w-14 h-14 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full flex items-center justify-center transition-all shadow-lg transition-colors"
                >
                  <Camera size={24} />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={editingMessageId ? "Edit your message..." : "Type your message..."}
                    className={`w-full px-8 py-4 border-none rounded-[2rem] focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-slate-200 ${
                      editingMessageId ? "bg-amber-500/10 pr-20" : "bg-slate-50 dark:bg-[#0F172A] focus:bg-slate-100 dark:focus:bg-slate-700"
                    }`}
                    value={newMessage}
                    onChange={handleTyping}
                  />
                  {editingMessageId && (
                    <button 
                      type="button"
                      onClick={() => {
                        setEditingMessageId(null);
                        setNewMessage("");
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-700 rounded-full text-slate-400 transition"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`w-14 h-14 rounded-full transition-all shadow-xl flex items-center justify-center disabled:opacity-50 disabled:shadow-none active:scale-95 group ${
                    editingMessageId ? "bg-cyan-400 text-slate-900 shadow-cyan-400/20" : "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-indigo-500/20 hover:brightness-110"
                  }`}
                >
                  {editingMessageId ? (
                    <CheckCheck size={20} className="relative group-hover:scale-110 transition" />
                  ) : (
                    <Send size={20} className="relative left-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  )}
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/30 transition-colors">
            <div className="p-8 bg-white dark:bg-[#1E293B] shadow-lg dark:shadow-black/20 rounded-full mb-6 border border-slate-100 dark:border-slate-600 transition-colors">
              <MessageSquare size={64} className="text-indigo-600 dark:text-indigo-400 opacity-20" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200 mb-2 transition-colors">Select a Conversation</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs text-center transition-colors">Choose someone from your contacts to start chatting in real-time.</p>
          </div>
        )}
      </main>
      {showMediaSidebar && (
        <aside className="w-80 border-l border-slate-200 dark:border-slate-600 flex flex-col bg-white dark:bg-[#0F172A] animate-in slide-in-from-right duration-300 shadow-2xl relative z-20 transition-colors">
          <header className="p-6 border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-[#1E293B] flex items-center justify-between transition-colors">
            <h3 className="font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest text-xs transition-colors">Media & Files</h3>
            <button onClick={() => setShowMediaSidebar(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition text-slate-500 dark:text-slate-400">
              <X size={18} />
            </button>
          </header>
          <div className="flex border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 transition-colors">
            {["media", "links", "docs"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition border-b-2 ${
                  activeTab === tab 
                    ? "text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 bg-indigo-500/10 dark:bg-indigo-400/5" 
                    : "text-slate-500 border-transparent hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white dark:bg-slate-900/20 transition-colors">
            {activeTab === "media" && (
              <div className="grid grid-cols-3 gap-2">
                {mediaData.media.map((m, i) => (
                  <div 
                    key={i} 
                    className="aspect-square bg-slate-800 rounded-lg overflow-hidden border border-slate-700/50 hover:border-indigo-500/50 transition cursor-pointer shadow-sm group" 
                    onClick={() => window.open(m.fileUrl, '_blank')}
                  >
                    <img src={m.fileUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Media" />
                  </div>
                ))}
                {mediaData.media.length === 0 && (
                  <div className="col-span-3 text-center py-12">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl inline-block mb-3 border border-slate-100 dark:border-slate-700 transition-colors">
                      <Image size={24} className="text-slate-400 dark:text-slate-600" />
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60 transition-colors">No media found</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === "links" && (
              <div className="space-y-3">
                {mediaData.links.map((l, i) => (
                  <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-600 rounded-2xl hover:border-indigo-500 transition-all group shadow-sm transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition">
                        <Paperclip size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{l.url.replace(/^https?:\/\//, '')}</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase font-black tracking-tighter transition-colors">Shared Link</p>
                      </div>
                    </div>
                  </a>
                ))}
                {mediaData.links.length === 0 && (
                  <div className="text-center py-12">
                    <div className="p-4 bg-slate-800/50 rounded-2xl inline-block mb-3 border border-slate-700">
                      <Paperclip size={24} className="text-slate-600" />
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">No links found</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === "docs" && (
              <div className="space-y-3">
                {mediaData.docs.map((d, i) => (
                  <a key={i} href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-600 rounded-2xl hover:border-violet-500 transition-all group shadow-sm transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">Document</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase font-black tracking-tighter transition-colors">Click to download</p>
                      </div>
                    </div>
                  </a>
                ))}
                {mediaData.docs.length === 0 && (
                  <div className="text-center py-12">
                    <div className="p-4 bg-slate-800/50 rounded-2xl inline-block mb-3 border border-slate-700">
                      <FileText size={24} className="text-slate-600" />
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">No documents found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      )}
      {forwardingMessage && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] shadow-2xl rounded-3xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300 border border-slate-200 dark:border-slate-600 transition-colors">
            <div className="p-6 border-b border-slate-200 dark:border-slate-600 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 transition-colors">
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-200 transition-colors">Forward Message</h3>
              <button onClick={() => setForwardingMessage(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition text-slate-500 dark:text-slate-400">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto transition-colors">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 px-2 transition-colors">Select Contact</p>
              <div className="space-y-1">
                {contacts.map(contact => (
                  <button 
                    key={contact._id} 
                    onClick={() => handleForwardMessage(contact)}
                    className="w-full flex items-center gap-4 p-3 hover:bg-slate-700/50 rounded-2xl transition group"
                  >
                    <div className="relative">
                      {contact.profileImage && contact.profileImage !== 'no-photo.jpg' ? (
                        <img src={contact.profileImage} alt={contact.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-700 shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg transition-colors">
                          {contact.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{contact.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-tighter font-medium transition-colors">{contact.role}</p>
                    </div>
                    <ChevronRight size={16} className="ml-auto text-slate-600 group-hover:text-indigo-400 transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {showInfoMessage && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] shadow-2xl rounded-3xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-300 border border-slate-200 dark:border-slate-600 transition-colors">
            <div className="p-6 border-b border-slate-200 dark:border-slate-600 flex items-center justify-between transition-colors">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200 transition-colors">Message Info</h3>
              <button onClick={() => setShowInfoMessage(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition text-slate-500 dark:text-slate-400">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 dark:bg-[#0F172A] rounded-2xl text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 transition-colors">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors">Sent</p>
                  <p className="font-medium text-slate-900 dark:text-slate-200 transition-colors">{new Date(showInfoMessage.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 dark:bg-[#0F172A] rounded-2xl text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 transition-colors">
                  <Check size={24} className={showInfoMessage.read ? "text-cyan-600 dark:text-cyan-400" : "text-slate-300 dark:text-slate-600"} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors">Status</p>
                  <p className="font-medium text-slate-900 dark:text-slate-200 transition-colors">{showInfoMessage.read ? "Read" : "Delivered"}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-600 transition-colors">
                 <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 transition-colors">Message Content</p>
                 <div className="p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl text-sm text-slate-700 dark:text-slate-400 italic border border-slate-200 dark:border-slate-600 transition-colors">
                    "{showInfoMessage.content}"
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <CallOverlay />
    </div>
  );
};
export default Messaging;
