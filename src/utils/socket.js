const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  const getSecretRoomId = (userId, targetUserId) => {
    return crypto
      .createHash("sha256")
      .update([userId, targetUserId].sort().join("_"))
      .digest("hex");
  };

  io.on("connection", (socket) => {
    // events
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log("Joining room: " + roomId);

      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ userId, targetUserId, firstName, lastName, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(firstName + " " + text);

          // Todo- check if userId and targetUserId are friends

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              senderId: userId,
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();
          io.to(roomId).emit("messageRecieved", { firstName, lastName, text });
        } catch (error) {
          console.log(error);
        }
      }
    );
    socket.on("disconenct", () => {});
  });
};

module.exports = initializeSocket;
