// Socket.IO.js
const { Server } = require("socket.io");
const Message = require("./model/ModelBanSam/Message");
const Conversation = require("./model/ModelBanSam/Conversation");
const NguoiDung = require("./model/ModelBanSam/NguoiDung"); 

let io;

// mapping
const socketUserMap = new Map(); // socketId -> userId
const userSocketCount = new Map(); // userId -> number of sockets
const onlineUsers = new Set();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "https://backendhungpham.pvhungit.id.vn",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id, "query:", socket.handshake.query);

    // auto-join if handshake provided userId (and not "undefined")
    const qUserId = socket.handshake.query?.userId;
    if (qUserId && String(qUserId).trim().toLowerCase() !== "undefined") {
      try {
        const uid = String(qUserId);
        socket.join(uid);
        socketUserMap.set(socket.id, uid);
        userSocketCount.set(uid, (userSocketCount.get(uid) || 0) + 1);
        onlineUsers.add(uid);
        io.emit("getOnlineUsers", Array.from(onlineUsers));
        console.log(`Auto-joined ${socket.id} -> ${uid}`);
      } catch (e) {
        console.warn("Auto-join error:", e.message);
      }
    }

    // join personal room
    socket.on("join", (userId, cb) => {
      try {
        if (!userId) {
          if (typeof cb === "function") cb({ ok: false, error: "Missing userId" });
          return;
        }
        const uid = String(userId);
        socket.join(uid);
        socketUserMap.set(socket.id, uid);
        userSocketCount.set(uid, (userSocketCount.get(uid) || 0) + 1);
        onlineUsers.add(uid);
        io.emit("getOnlineUsers", Array.from(onlineUsers));
        console.log(`User ${uid} joined (socket ${socket.id})`);
        if (typeof cb === "function") cb({ ok: true });
      } catch (e) {
        console.error("join error:", e);
        if (typeof cb === "function") cb({ ok: false, error: e.message });
      }
    });

    // join by role room (e.g., 'support')
    socket.on("joinRole", (role, callback) => {
      try {
        if (!role) {
          if (typeof callback === "function") callback({ ok: false, error: "Missing role" });
          return;
        }
        socket.join(role);
        console.log(`Socket ${socket.id} joined role room: ${role}`);
        if (typeof callback === "function") callback({ ok: true });
      } catch (e) {
        console.error("joinRole error:", e);
        if (typeof callback === "function") callback({ ok: false, error: e.message });
      }
    });

    // sendMessage handling
    socket.on("sendMessage", async (payload) => {
      try {
        console.log("DEBUG sendMessage called with payload:", payload, "socket.id:", socket.id);

        let { conversationId, senderId, receiverId, content } = payload || {};

        const norm = (v) => {
          if (v === undefined || v === null) return null;
          if (typeof v === "string" && v.trim().toLowerCase() === "undefined") return null;
          if (typeof v === "string" && v.trim() === "") return null;
          return v;
        };

        conversationId = norm(conversationId);
        senderId = norm(senderId);
        receiverId = norm(receiverId);
        content = norm(content);

        // infer senderId from socket map
        if (!senderId) {
          const inferred = socketUserMap.get(socket.id);
          if (inferred) {
            console.warn("sendMessage: inferred senderId from socketUserMap:", inferred);
            senderId = inferred;
          }
        }

        // infer receiverId from conversation if missing
        if (!receiverId && conversationId) {
          try {
            const convo = await Conversation.findById(conversationId).lean();
            if (convo && Array.isArray(convo.participants)) {
              const other = convo.participants.find((p) => String(p) !== String(senderId));
              if (other) receiverId = String(other);
            }
          } catch (e) {
            console.warn("Infer receiverId failed:", e.message);
          }
        }

        if (!conversationId || !senderId || !content) {
          const errObj = { conversationId, senderId, receiverId, content };
          console.warn("sendMessage missing required fields, aborting. payload:", errObj, "socket.id:", socket.id);
          socket.emit("sendMessageAck", { ok: false, error: "Missing conversationId or senderId or content", payload: errObj });
          return;
        }

        // Create message
        const newMessage = new Message({
          conversationId,
          sender: senderId,
          content,
          readBy: [senderId],
        });

        await newMessage.save();

        // Update conversation lastMessage
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: { content, sender: senderId, createdAt: new Date() },
        });

        // Populate for consistent client payload
        const populatedMessage = await Message.findById(newMessage._id).populate("sender", "hoTen avatar");

        // Emit to receiver & sender rooms
        const sId = String(senderId);
        const rId = receiverId ? String(receiverId) : null;

        if (rId) {
          io.to(rId).emit("receiveMessage", populatedMessage);
          io.to(rId).emit("newMessage", populatedMessage);
        }

        io.to(sId).emit("receiveMessage", populatedMessage);
        io.to(sId).emit("newMessage", populatedMessage);
        io.to(sId).emit("messageSaved", populatedMessage);

        // Additional: if sender is a normal user, broadcast to support room
        try {
          const senderUser = await NguoiDung.findById(String(senderId)).lean();
          if (senderUser && (senderUser.vaiTro === "user" || !senderUser.vaiTro)) {
            io.to("support").emit("newMessage", populatedMessage);
            io.to("support").emit("receiveMessage", populatedMessage);
          }
        } catch (e) {
          console.warn("Could not determine sender role for support broadcast:", e.message);
        }

        socket.emit("sendMessageAck", { ok: true, messageId: populatedMessage._id });
        console.log("sendMessage: saved & emitted", populatedMessage._id);
      } catch (err) {
        console.error("ERROR sendMessage:", err, "socket.id:", socket.id);
        socket.emit("sendMessageAck", { ok: false, error: err.message });
      }
    });

    socket.on("markReadEvent", ({ conversationId, readerId }) => {
      try {
        if (!conversationId || !readerId) return;
        io.to(conversationId).emit("messagesRead", { conversationId, readerId });
      } catch (e) {
        console.warn("markReadEvent err:", e.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
      const userId = socketUserMap.get(socket.id);
      if (userId) {
        const cnt = (userSocketCount.get(userId) || 1) - 1;
        if (cnt <= 0) {
          userSocketCount.delete(userId);
          onlineUsers.delete(userId);
        } else {
          userSocketCount.set(userId, cnt);
        }
        socketUserMap.delete(socket.id);
        io.emit("getOnlineUsers", Array.from(onlineUsers));
        console.log(`User ${userId} disconnected. remaining sockets: ${userSocketCount.get(userId) || 0}`);
      }
    });
  });

  return io;
};

const getIo = () => {
  if (!io) throw new Error("Socket.io chưa được khởi tạo!");
  return io;
};

module.exports = { initSocket, getIo };
