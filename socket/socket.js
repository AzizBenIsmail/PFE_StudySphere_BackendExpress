// // socketConfig.js

// const socketIo = require('socket.io');

// function initializeSocket(server) {
//   const io = socketIo(server);

//   io.on('connection', (socket) => {
//     console.log('Un client est connecté');

//     // Gestion de la déconnexion du client
//     socket.on('disconnect', () => {
//       console.log('Un client est déconnecté');
//     });
//   });

//   return io;
// }

// module.exports = initializeSocket;


const mongoose = require("mongoose");


const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

io.on('connection', (socket) => {
  console.log('A user connected');  // This should print when a client connects
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
   
  });

  
});

module.exports = { app, io, server, getReceiverSocketId: (receiverId) => userSocketMap[receiverId] };