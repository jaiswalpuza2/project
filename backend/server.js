const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
dotenv.config();
connectDB();
const app = express();


app.use(helmet());
app.use(compression());
app.use(cors());


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api/auth", authLimiter);

app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/saved-jobs", require("./routes/savedJobRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/mentorships", require("./routes/mentorshipRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.get("/", (req, res) => {
  res.send("JobSphere API is running...");
});
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error('--- GLOBAL ERROR HANDLER ---');
  console.error('Status Code:', statusCode);
  console.error('Error Message:', err.message);
  console.error('Error Stack:', err.stack);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
});
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });
  socket.on("sendMessage", async (data) => {
    const { saveMessage } = require("./controllers/chatController");
    const savedMsg = await saveMessage(data);
    if (savedMsg) {
      const fullMsg = {
        _id: savedMsg._id,
        senderId: savedMsg.sender,
        recipientId: savedMsg.recipient,
        content: savedMsg.content,
        type: savedMsg.type,
        fileUrl: savedMsg.fileUrl,
        location: savedMsg.location,
        createdAt: savedMsg.createdAt,
        jobId: savedMsg.job,
        replyTo: savedMsg.replyTo
      };
      io.to(data.recipientId).emit("messageReceived", fullMsg);
      socket.emit("messageSent", fullMsg);
    }
  });
  socket.on("typing", (data) => {
    io.to(data.recipientId).emit("userTyping", data);
  });
  socket.on("deleteMessage", (data) => {
    io.to(data.recipientId).emit("messageDeleted", { messageId: data.messageId });
  });
  socket.on("editMessage", (data) => {
    io.to(data.recipientId).emit("messageUpdated", { 
      messageId: data.messageId, 
      content: data.content,
      isEdited: true 
    });
  });
  socket.on("pinMessage", (data) => {
    io.to(data.recipientId).emit("messagePinned", { 
      messageId: data.messageId, 
      isPinned: data.isPinned 
    });
  });
  socket.on("reactMessage", (data) => {
    io.to(data.recipientId).emit("messageReacted", { 
      messageId: data.messageId, 
      reactions: data.reactions 
    });
  });
  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", { 
      signal: data.signalData, 
      from: data.from, 
      name: data.name,
      callType: data.callType 
    });
  });
  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
  socket.on("iceCandidate", (data) => {
    io.to(data.to).emit("iceCandidate", data.candidate);
  });
  socket.on("endCall", (data) => {
    io.to(data.to).emit("callEnded");
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  const mode = process.env.NODE_ENV || "development";
  console.log(`Server running in ${mode} mode on port ${PORT}`);
});
