import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState({}); // { userId: isTyping }

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io("http://localhost:5000");
      setSocket(newSocket);

      newSocket.emit("join", user.id);

      newSocket.on("messageReceived", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      newSocket.on("messageSent", (message) => {
        // Sync local message with DB metadata (like _id and createdAt)
        setMessages((prev) => {
          // If message already exists in state (added by sendMessage), update it
          // Otherwise just add it
          const existingIdx = prev.findIndex(m => m.content === message.content && m.senderId === message.senderId && !m._id);
          if (existingIdx !== -1) {
            const updated = [...prev];
            updated[existingIdx] = message;
            return updated;
          }
          return [...prev, message];
        });
      });

      newSocket.on("userTyping", (data) => {
        setTypingStatus((prev) => ({ ...prev, [data.senderId]: data.isTyping }));
      });

      return () => newSocket.close();
    }
  }, [isAuthenticated, user]);

  const sendMessage = (messageData) => {
    if (socket) {
      socket.emit("sendMessage", messageData);
      // Optimistic update (without _id)
      setMessages((prev) => [...prev, { ...messageData, createdAt: new Date().toISOString() }]);
    }
  };

  const sendTyping = (recipientId, isTyping) => {
    if (socket) {
      socket.emit("typing", { senderId: user.id, recipientId, isTyping });
    }
  };

  return (
    <SocketContext.Provider value={{ socket, messages, setMessages, sendMessage, typingStatus, sendTyping }}>
      {children}
    </SocketContext.Provider>
  );
};
