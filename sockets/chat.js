/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
// chat.js
module.exports = (io, socket, onlineUsers) => {
  // Future socket listeners will be here
  const newLocal = '🔌 New user connected! 🔌';
  console.log(newLocal);

  // Listen for "new user" socket emits
  socket.on('new user', (username) => {
    // Save the username as key to access the user's socket id
    console.log(onlineUsers);
    onlineUsers[username] = socket.id;
    console.log(onlineUsers);
    // Save the username to socket as well. This is important for later.
    socket['username'] = username;
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

  socket.on('get online users', () => {
    // Send over the onlineUsers
    console.log('inside get online users function: ', onlineUsers);
    io.emit('get online users', onlineUsers);
    // io.emit('get online users', onlineUsers);
  });
};
