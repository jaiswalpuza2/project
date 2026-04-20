import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Zap, MessageCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I'm your Jobsphere AI Career Assistant. I can help you with job searches, optimizing your profile, writing proposals, or providing career advice. How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + "/api/ai/chatbot", {
        message: userMessage,
        context: "Jobsphere dedicated AI Chatbot page. Providing comprehensive career guidance and platform support.",
      });

      setMessages((prev) => [...prev, { role: "bot", content: response.data.data }]);
    } catch (error) {
      console.error("Chatbot error", error);
      toast.error("Failed to connect to AI assistant.");
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "I'm having trouble connecting right now. Please check your connection or try again in a moment." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-h-[850px] bg-[#0F172A] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">

      <div className="p-6 bg-[#1E293B] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
              Jobsphere AI Assistant <Sparkles size={18} className="text-yellow-400 fill-yellow-400" />
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Online & Ready to Help</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-lg ${
                msg.role === "user" 
                ? "bg-indigo-600 text-white" 
                : "bg-slate-700 text-indigo-400 border border-slate-600"
              }`}>
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div className={`p-4 rounded-2xl shadow-xl transition-all ${
                msg.role === "user" 
                ? "bg-indigo-600 text-white rounded-tr-none font-medium" 
                : "bg-[#1E293B] text-slate-200 border border-slate-700 rounded-tl-none"
              }`}>
                {msg.role === "bot" ? (
                  <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-indigo-300 prose-strong:text-indigo-400 prose-code:bg-slate-800 prose-code:p-1 prose-code:rounded">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%] items-center">
               <div className="w-8 h-8 rounded-lg bg-slate-700 text-indigo-400 border border-slate-600 flex items-center justify-center shrink-0 animate-pulse">
                <Bot size={16} />
              </div>
              <div className="bg-[#1E293B] border border-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                </div>
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-6 py-3 bg-[#1E293B]/50 border-t border-slate-800/50 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            "How can I improve my resume?",
            "Tips for job interviews?",
            "Write a cover letter for me",
            "Highest paying skills in 2024?"
          ].map((prompt, i) => (
            <button 
              key={i} 
              onClick={() => {
                setInput(prompt);

              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 whitespace-nowrap transition-colors flex items-center gap-2 group"
            >
              <Zap size={12} className="text-yellow-500 group-hover:scale-125 transition-transform" />
              {prompt}
            </button>
          ))}
      </div>

      <div className="p-6 bg-[#1E293B] border-t border-slate-800">
        <form onSubmit={handleSend} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="w-full bg-[#0F172A] border-2 border-slate-700 rounded-2xl px-6 py-4 pr-16 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-medium shadow-inner"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-500 mt-4 font-bold uppercase tracking-[0.2em]">
          Powered by Gemini AI • Always verify important information
        </p>
      </div>
    </div>
  );
};

export default AIChatbot;
