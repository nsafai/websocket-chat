/* eslint-disable no-console */
// chat.js
module.exports = (io, socket) => {
  // Future socket listeners will be here
  const newLocal = '🔌 New user connected! 🔌';
  console.log(newLocal);

  // Listen for "new user" socket emits
  socket.on('new user', (username) => {
    console.log(`✋ ${username} has joined the chat! ✋`);
    // Send the username to all clients currently connected
    io.emit('new user', username);
  });

  // Listen for new messages
  socket.on('new message', (data) => {
    // Send that data back to ALL clients
    console.log(`🎤 ${data.sender}: ${data.message} 🎤`);
    io.emit('new message', data);
  });
};
