const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");


require("dotenv").config();
require("./config/passport-setup");


// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/upload");
const postRoutes = require("./routes/postRoutes");
const messageRoutes = require("./routes/messageRoutes");



const app = express();



// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: [
            "http://20.255.50.15:3000",
            "http://skillswap.eastasia.cloudapp.azure.com:3000"
        ],
        credentials: true,
    })
);


// Initialize Passport
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);


// Serve uploads as static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
    "/uploads/profile-pictures",
    express.static(path.join(__dirname, "uploads/profile-pictures"))
);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI || "mongodb://mongo:27017/skillswap", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB error:", err));

// =======================
// Setup HTTP + Socket.IO
// =======================
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*', // React frontend
        methods: ["GET", "POST"],
        credentials: true, // allow cookies
    },
});

// Store online users { userId: socketId }
const onlineUsers = {};

// Middleware to authenticate socket using cookie JWT
// Middleware to authenticate socket using cookie JWT OR query token
io.use((socket, next) => {
    try {
        let token;

        // 1. Try cookie first
        const cookieHeader = socket.handshake.headers.cookie;
        if (cookieHeader) {
            const match = cookieHeader.match(/jwt=([^;]+)/);
            if (match) token = match[1];
        }

        // 2. Fallback: check auth token in query
        if (!token && socket.handshake.auth?.token) {
            token = socket.handshake.auth.token;
        }

        if (!token) {
            console.error("❌ No JWT provided for socket");
            return next(new Error("Authentication failed: no token"));
        }

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;

        console.log("✅ Socket authenticated:", socket.userId);
        next();
    } catch (err) {
        console.error("❌ Socket auth error:", err.message);
        next(new Error("Authentication failed"));
    }
});

// Handle connections
io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);
    onlineUsers[socket.userId] = socket.id;

    // Private message
    socket.on("privateMessage", async ({ to, text }) => {
        try {
            const msg = await Message.create({
                from: socket.userId,
                to,
                text,
                status: "sent",
            });

            // Send to recipient if online
            if (onlineUsers[to]) {
                io.to(onlineUsers[to]).emit("privateMessage", msg);

                msg.status = "delivered";
                await msg.save();

                socket.emit("messageStatus", { id: msg._id, status: "delivered" });
            } else {
                socket.emit("messageStatus", { id: msg._id, status: "sent" });
            }
        } catch (err) {
            console.error("❌ Error sending private message:", err);
            socket.emit("messageError", { error: err.message });
        }
    });

    // Message seen
    socket.on("messageSeen", async (msgId) => {
        try {
            const msg = await Message.findByIdAndUpdate(msgId, { status: "seen" }, { new: true });
            if (msg && onlineUsers[msg.from]) {
                io.to(onlineUsers[msg.from]).emit("messageStatus", { id: msg._id, status: "seen" });
            }
        } catch (err) {
            console.error("❌ Error marking message as seen:", err);
        }
    });

    // Disconnect
    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.userId}`);
        delete onlineUsers[socket.userId];
    });
});


// =======================
// Start server
// =======================
// Start the HTTP server instead of app.listen
server.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
);
