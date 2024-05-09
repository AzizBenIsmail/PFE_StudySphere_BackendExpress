// socketConfig.js

const socketIo = require('socket.io');

function initializeSocket(server) {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('Un client est connecté');

    // Gestion de la déconnexion du client
    socket.on('disconnect', () => {
      console.log('Un client est déconnecté');
    });
  });

  return io;
}

module.exports = initializeSocket;
