export const initSocket = (io) => {
  const roomUsers = {};
  const onlineUsers = {}; // userId -> socketId

  const broadcastOnlineUsers = () => {
    // Emit the list of online user IDs to ALL connected clients
    io.emit("online_users", Object.keys(onlineUsers));
  };

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("register", (userId) => {
      onlineUsers[userId] = socket.id;
      console.log(`✅ User ${userId} registered with socket ${socket.id}`);
      broadcastOnlineUsers(); // notify everyone
    });

    socket.on("new_room", (room) => {
      socket.broadcast.emit("room_created", room);
    });

    socket.on("join_room", ({ roomId, userId, username }) => {
      socket.join(roomId);
      if (!roomUsers[roomId]) roomUsers[roomId] = [];
      roomUsers[roomId] = roomUsers[roomId].filter(u => u.userId !== userId);
      roomUsers[roomId].push({ userId, username, socketId: socket.id });
      io.to(roomId).emit("room_users", roomUsers[roomId]);
      socket.to(roomId).emit("user_joined", { username });
    });

    socket.on("send_message", ({ roomId, message }) => {
      socket.to(roomId).emit("receive_message", message);
    });

    socket.on("send_dm", ({ receiverId, message }) => {
      const receiverSocketId = onlineUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_dm", message);
      }
    });

    socket.on("leave_room", ({ roomId, userId, username }) => {
      socket.leave(roomId);
      if (roomUsers[roomId]) {
        roomUsers[roomId] = roomUsers[roomId].filter(u => u.userId !== userId);
        io.to(roomId).emit("room_users", roomUsers[roomId]);
      }
      socket.to(roomId).emit("user_left", { username });
    });

    socket.on("disconnect", () => {
      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          break;
        }
      }
      for (const roomId in roomUsers) {
        roomUsers[roomId] = roomUsers[roomId].filter(u => u.socketId !== socket.id);
        io.to(roomId).emit("room_users", roomUsers[roomId]);
      }
      broadcastOnlineUsers(); // notify everyone of disconnect
      console.log("❌ User disconnected:", socket.id);
    });
  });
};
