export const initSocket = (io) => {
  const roomUsers = {};
  const onlineUsers = {}; // userId -> socketId

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // Register user as online
    socket.on("register", (userId) => {
      onlineUsers[userId] = socket.id;
      console.log(`✅ User ${userId} registered with socket ${socket.id}`);
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
      // Broadcast to everyone in room except sender
      socket.to(roomId).emit("receive_message", message);
    });

    // DM — look up receiver's socket by their user ID
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
      // Remove from onlineUsers
      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          break;
        }
      }
      // Remove from rooms
      for (const roomId in roomUsers) {
        roomUsers[roomId] = roomUsers[roomId].filter(u => u.socketId !== socket.id);
        io.to(roomId).emit("room_users", roomUsers[roomId]);
      }
      console.log("❌ User disconnected:", socket.id);
    });
  });
};
