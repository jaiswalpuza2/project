import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState({}); // { userId: isTyping }

  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);

  const connectionRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(import.meta.env.VITE_API_URL, {
        transports: ["websocket"]
      });
      setSocket(newSocket);

      newSocket.emit("join", user.id || user._id);

      newSocket.on("messageReceived", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      newSocket.on("messageSent", (message) => {

        setMessages((prev) => {

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

      newSocket.on("messageDeleted", (data) => {

        setMessages((prev) => prev.filter((m) => m._id !== data.messageId));
      });

      newSocket.on("messageUpdated", (data) => {

        setMessages((prev) => prev.map((m) => 
          m._id === data.messageId ? { ...m, content: data.content, isEdited: data.isEdited } : m
        ));
      });

      newSocket.on("messagePinned", (data) => {

        setMessages((prev) => prev.map((m) => 
          m._id === data.messageId ? { ...m, isPinned: data.isPinned } : m
        ));
      });

      newSocket.on("messageReacted", (data) => {

        setMessages((prev) => prev.map((m) => 
          m._id === data.messageId ? { ...m, reactions: data.reactions } : m
        ));
      });

      newSocket.on("callUser", ({ from, name: callerName, signal, callType }) => {
        setReceivingCall(true);
        setCall({ isReceivingCall: true, from, name: callerName, signal, callType });
      });

      newSocket.on("callEnded", () => {
        setCallEnded(true);
        setCallAccepted(false);
        setReceivingCall(false);
        setCall({});

        if (connectionRef.current) {
          connectionRef.current.close();
          connectionRef.current = null;
        }

        setStream(prev => {
          if (prev) prev.getTracks().forEach(track => track.stop());
          return null;
        });
        setRemoteStream(null);
      });

      return () => newSocket.close();
    }
  }, [isAuthenticated, user]);

  const answerCall = async () => {
    setCallAccepted(true);
    setReceivingCall(false);

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    connectionRef.current = peer;

    const currentStream = await navigator.mediaDevices.getUserMedia({ 
      video: call.callType === 'video', 
      audio: true 
    });
    setStream(currentStream);

    currentStream.getTracks().forEach(track => peer.addTrack(track, currentStream));

    peer.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", { to: call.from, candidate: event.candidate });
      }
    };

    await peer.setRemoteDescription(new RTCSessionDescription(call.signal));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("answerCall", { signal: answer, to: call.from });

    socket.on("iceCandidate", (candidate) => {
      peer.addIceCandidate(new RTCIceCandidate(candidate));
    });
  };

  const callUser = async (id, type) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    connectionRef.current = peer;

    const currentStream = await navigator.mediaDevices.getUserMedia({ 
      video: type === 'video', 
      audio: true 
    });
    setStream(currentStream);

    currentStream.getTracks().forEach(track => peer.addTrack(track, currentStream));

    peer.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", { to: id, candidate: event.candidate });
      }
    };

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit("callUser", {
      userToCall: id,
      signalData: offer,
      from: user.id || user._id,
      name: user.name,
      callType: type
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.setRemoteDescription(new RTCSessionDescription(signal));
    });

    socket.on("iceCandidate", (candidate) => {
      peer.addIceCandidate(new RTCIceCandidate(candidate));
    });

    setCall({ isCalling: true, to: id, callType: type });
  };

  const leaveCall = (recipientId) => {
    setCallEnded(true);
    setCallAccepted(false);
    setReceivingCall(false);
    setCall({});

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setRemoteStream(null);

    if (connectionRef.current) {
      connectionRef.current.close();
      connectionRef.current = null;
    }

    socket.emit("endCall", { to: recipientId || call.from || call.to });
  };

  const sendMessage = (messageData) => {
    if (socket) {
      socket.emit("sendMessage", messageData);

      setMessages((prev) => [...prev, { ...messageData, createdAt: new Date().toISOString() }]);
    }
  };

  const sendTyping = (recipientId, isTyping) => {
    if (socket) {
      socket.emit("typing", { senderId: user.id || user._id, recipientId, isTyping });
    }
  };

  const deleteMessage = (messageId, recipientId) => {
    if (socket) {
      socket.emit("deleteMessage", { messageId, recipientId });
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    }
  };

  const editMessage = (messageId, content, recipientId) => {
    if (socket) {
      socket.emit("editMessage", { messageId, content, recipientId });
      setMessages((prev) => prev.map((m) => 
        m._id === messageId ? { ...m, content, isEdited: true } : m
      ));
    }
  };

  const pinMessage = (messageId, isPinned, recipientId) => {
    if (socket) {
      socket.emit("pinMessage", { messageId, isPinned, recipientId });
      setMessages((prev) => prev.map((m) => 
        m._id === messageId ? { ...m, isPinned } : m
      ));
    }
  };

  const reactMessage = (messageId, reactions, recipientId) => {
    if (socket) {
      socket.emit("reactMessage", { messageId, reactions, recipientId });
      setMessages((prev) => prev.map((m) => 
        m._id === messageId ? { ...m, reactions } : m
      ));
    }
  };

  return (
    <SocketContext.Provider value={{ 
      socket, messages, setMessages, sendMessage, sendTyping, 
      deleteMessage, editMessage, pinMessage, reactMessage, typingStatus,
      call, callAccepted, callEnded, stream, remoteStream, receivingCall,
      setReceivingCall, answerCall, callUser, leaveCall
    }}>
      {children}
    </SocketContext.Provider>
  );
};
