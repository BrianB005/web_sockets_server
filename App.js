require("express-async-errors");
const http = require("http");
const express = require("express");
const app = express();

const server = http.createServer(app);

const socketIO = require("socket.io");
const io = socketIO(server);

const rateLimiter = require("express-rate-limit");

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  socket.on("deviceConnected", async (deviceId) => {
    try {
      io.emit("userOnline", userId);
      console.log(`Device with ID ${deviceId} just joined`);
    } catch (error) {
      console.error("Error updating device online status:", error);
    }
  });
  socket.on("newMessage", (message) => {
    socket.join(socket.id);
    console.log(message);
    io.emit(message);
  });

  socket.on("disconnect", async () => {
    console.log(`User with ID ${socket.id} just left`);
    io.emit("userOffline", socket.deviceId);
  });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server is currently listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
