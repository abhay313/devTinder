const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // events
    socket.on("joinChat", () => {});
    socket.on("sendMessage", () => {});
    socket.on("disconenct", () => {});
  });
};

module.exports = initializeSocket;
