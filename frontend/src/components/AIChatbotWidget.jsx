import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import api from "../utils/api";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
  const AIChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
      { role: "bot", content: "Hi! I'm the Jobsphere AI assistant. How can I help you today?" },
    ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
      if (isOpen) {
        scrollToBottom();
      }
    }, [messages, isOpen]);
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
  const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);
    try {
  const response = await api.post("/ai/chatbot", {
        message: userMessage,
        context: "Jobsphere freelancing platform. Helping users navigate jobs, proposals, and profiles.",
      });
      setMessages((prev) => [...prev, { role: "bot", content: response.data.data }]);
    } catch (error) {
      console.error("Chatbot error", error);
      toast.error("Failed to connect to AI assistant.");
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, I am currently unavailable. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-700 transition-all z-50 flex items-center justify-center transform hover:scale-105 border border-indigo-500/20"
        >
          <MessageSquare size={24} />
        </button>
      )}
      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-96 bg-white dark:bg-[#0F172A] md:rounded-2xl shadow-2xl overflow-hidden z-[100] flex flex-col border border-gray-200 dark:border-slate-700 md:h-[500px] md:max-h-[80vh] transition-all duration-300">
          <div className="bg-[#1E293B] dark:bg-[#1E293B] text-white p-5 md:p-4 flex justify-between items-center border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-black tracking-tight uppercase text-[11px] md:text-xs text-white">Jobsphere AI</h3>
                <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mt-0.5">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm shadow-sm"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.role === "bot" ? (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-p:text-gray-800 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-ul:text-gray-800 prose-li:text-gray-800 text-gray-800">
                       <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className={`text-sm break-words ${msg.role === "user" ? "text-white" : "text-gray-800"}`}>{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 placeholder:text-gray-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-slate-800 text-white p-2 rounded-xl hover:bg-indigo-600 transition disabled:opacity-50 flex items-center justify-center min-w-[40px] shadow-sm"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
export default AIChatbotWidget;
