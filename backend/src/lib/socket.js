export const initSocket = (io) => {
  const roomUsers = {};

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("join_room", ({ roomId, userId, username }) => {
      socket.join(roomId);
      if (!roomUsers[roomId]) roomUsers[roomId] = [];
      roomUsers[roomId] = roomUsers[roomId].filter(u => u.userId !== userId);
      roomUsers[roomId].push({ userId, username, socketId: socket.id });
      io.to(roomId).emit("room_users", roomUsers[roomId]);
      socket.to(roomId).emit("user_joined", { username });
    });

    socket.on("send_message", ({ roomId, message }) => {
      io.to(roomId).emit("receive_message", message);
    });

    socket.on("send_dm", ({ receiverSocketId, message }) => {
      io.to(receiverSocketId).emit("receive_dm", message);
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
      for (const roomId in roomUsers) {
        roomUsers[roomId] = roomUsers[roomId].filter(u => u.socketId !== socket.id);
        io.to(roomId).emit("room_users", roomUsers[roomId]);
      }
      console.log("❌ User disconnected:", socket.id);
    });
  });
};