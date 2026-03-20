import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { Send, User, MessageSquare, Search } from "lucide-react";

const Messaging = () => {
  const location = useLocation();
  const { user, token } = useAuth();
  const { messages, sendMessage, setMessages, typingStatus, sendTyping } = useSocket();
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [contacts, setContacts] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchContacts();
    
    // Check if we came from "Start Project"
    if (location.state?.initialContact) {
      const contact = location.state.initialContact;
      setActiveChat(contact);
      
      // Add to contacts if not already there
      setContacts(prev => {
        const exists = prev.find(c => c._id === contact._id);
        if (!exists) return [contact, ...prev];
        return prev;
      });
    }
  }, [location.state]);

  useEffect(() => {
    if (activeChat) {
      fetchChatHistory(activeChat._id);
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingStatus]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chat/contacts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChatHistory = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.data.map(m => ({
        _id: m._id,
        senderId: m.sender,
        recipientId: m.recipient,
        content: m.content,
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
    if (!newMessage.trim() || !activeChat) return;

    const messageData = {
      senderId: user.id || user._id,
      recipientId: activeChat._id,
      content: newMessage,
      senderName: user.name
    };

    sendMessage(messageData);
    setNewMessage("");
    sendTyping(activeChat._id, false);
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-white flex overflow-hidden border-t">
      {/* Sidebar - Contacts */}
      <aside className="w-80 border-r flex flex-col bg-gray-50 shrink-0">
        <div className="p-6 border-b bg-white">
          <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition font-medium"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <div
                key={contact._id}
                onClick={() => setActiveChat(contact)}
                className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-white transition border-l-4 ${
                  activeChat?._id === contact._id ? "bg-white border-blue-600 shadow-sm" : "border-transparent"
                }`}
              >
                <div className="relative">
                  <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg uppercase">
                    {contact.name[0]}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900 truncate tracking-tight">{contact.name}</h4>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">10:45 AM</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate font-medium uppercase tracking-wider">{contact.role}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-400">
              <div className="p-6 bg-white rounded-3xl shadow-sm mb-6 inline-block">
                <MessageSquare size={48} className="text-blue-600 opacity-20" />
              </div>
              <p className="text-sm font-bold text-gray-900 uppercase tracking-widest opacity-40">No Messages</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-white min-w-0">
        {activeChat ? (
          <>
            <header className="px-8 py-5 border-b flex items-center justify-between bg-white z-10 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg uppercase">
                  {activeChat.name[0]}
                </div>
                <div>
                  <h3 className="font-black text-gray-900 tracking-tight">{activeChat.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">Active Now</p>
                  </div>
                </div>
              </div>
            </header>

            <div className="flex-1 px-8 py-6 overflow-y-auto space-y-6 bg-slate-50/50">
              {messages.filter(m => 
                (m.senderId === (user.id || user._id) && m.recipientId === activeChat._id) || 
                (m.senderId === activeChat._id && m.recipientId === (user.id || user._id))
              ).map((msg, idx) => (
                <div
                  key={msg._id || idx}
                  className={`flex ${msg.senderId === (user.id || user._id) ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex flex-col ${msg.senderId === (user.id || user._id) ? "items-end" : "items-start"}`}>
                    <div
                      className={`max-w-[85%] lg:max-w-[70%] p-4 rounded-2xl shadow-sm ${
                        msg.senderId === (user.id || user._id)
                          ? "bg-blue-600 text-white rounded-tr-none shadow-blue-100/50"
                          : "bg-white text-gray-900 rounded-tl-none border border-gray-100"
                      }`}
                    >
                      <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                    </div>
                    <span className="text-[9px] mt-2 text-gray-400 font-black uppercase tracking-widest flex items-center gap-1">
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {msg.senderId === (user.id || user._id) && msg._id && (
                        <span className="text-blue-500">✓✓</span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
              
              {typingStatus[activeChat._id] && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <div className="flex space-x-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <footer className="p-6 bg-white border-t border-gray-100">
              <form onSubmit={handleSend} className="flex gap-4 max-w-5xl mx-auto">
                <input
                  type="text"
                  placeholder="Design your message..."
                  className="flex-1 px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-gray-800"
                  value={newMessage}
                  onChange={handleTyping}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white w-14 h-14 rounded-full hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center disabled:opacity-50 disabled:shadow-none active:scale-90"
                >
                  <Send size={22} className="relative left-0.5" />
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-gray-400 bg-gray-50/30">
            <div className="p-8 bg-white rounded-full shadow-sm mb-6 border border-gray-100">
              <MessageSquare size={64} className="text-blue-600 opacity-20" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Conversation</h3>
            <p className="text-sm text-gray-500 max-w-xs text-center">Choose someone from your contacts to start chatting in real-time.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Messaging;
