const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Set static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes placeholder
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

app.get("/", (req, res) => {
  res.send("JobSphere API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
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
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });

  socket.on("sendMessage", async (data) => {
    // data: { senderId, recipientId, content, jobId }
    const { saveMessage } = require("./controllers/chatController");
    const savedMsg = await saveMessage(data);
    
    if (savedMsg) {
      // Emit full message with timestamp and DB ID
      const fullMsg = {
        _id: savedMsg._id,
        senderId: savedMsg.sender,
        recipientId: savedMsg.recipient,
        content: savedMsg.content,
        createdAt: savedMsg.createdAt,
        jobId: savedMsg.job
      };
      
      io.to(data.recipientId).emit("messageReceived", fullMsg);
      // Also emit back to sender to sync their local state with DB metadata
      socket.emit("messageSent", fullMsg);
    }
  });

  socket.on("typing", (data) => {
    // data: { senderId, recipientId, isTyping }
    io.to(data.recipientId).emit("userTyping", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
