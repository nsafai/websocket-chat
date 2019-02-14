/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
// chat.js
module.exports = (io, socket, onlineUsers, channels) => {
  // Future socket listeners will be here
  const newLocal = '🔌 New user connected! 🔌';
  console.log(newLocal);

  // Listen for "new user" socket emits
  socket.on('new user', (username) => {
    // Save the username as key to access the user's socket id
    onlineUsers[username] = socket.id;
    console.log(onlineUsers);
    // Save the username to socket as well. This is important for later.
    socket.username = username;
    console.log(`✋ ${username} has joined the chat! ✋`);
    // Send the username to all clients currently connected
    io.emit('new user', username);
  });

  // Listen for log out request
  socket.on('log out', (username) => {
    console.log(`${username} is trying to log out.`);
    socket.disconnect();
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
    socket.emit('get online users', onlineUsers);
    // io.emit('get online users', onlineUsers);
  });

  // This fires when a user closes out of the application
  socket.on('disconnect', () => {
    console.log(socket.username, 'has disconnected');
    // This deletes the user by using the username we saved to the socket
    delete onlineUsers[socket.username];
    io.emit('user has left', onlineUsers);
  });

  // Create new channel
  socket.on('new channel', (newChannel) => {
    console.log('creating new channel:', newChannel);
    // Save the new channel to our channels object. The array will hold the messages.
    channels[newChannel] = [];
    // Have the socket join the new channel room.
    socket.join(newChannel);
    // Inform all clients of the new channel.
    io.emit('new channel', newChannel);
    // Emit to the client that made the new channel, to change their channel to the one they made.
    socket.emit('user changed channel', {
      channel: newChannel,
      messages: channels[newChannel],
    });
  });
};
