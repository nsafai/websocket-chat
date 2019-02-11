/* eslint-disable no-undef */


$(document).ready(() => {
  // Connect to the socket.io server
  const socket = io.connect();
  // Keep track of the current user
  let currentUser;
  // Get the online users from the server
  socket.emit('get online users');


  $('#createUserBtn').click((e) => {
    e.preventDefault();
    currentUser = $('#usernameInput').val();
    if (currentUser.length > 0) {
      // Emit to the server the new user
      socket.emit('new user', currentUser);
      $('.usernameForm').remove();
      // Have the main page visible
      $('.mainContainer').css('display', 'flex');
    }
  });

  $('#sendChatBtn').click((e) => {
    e.preventDefault();
    // Get the message text value
    const message = $('#chatInput').val();
    // Make sure it's not empty
    if (message.length > 0) {
      console.log('emit new message from frontend');
      // Emit the message with the current user to the server
      socket.emit('new message', {
        sender: currentUser,
        message,
      });

      $('#chatInput').val('');
    }
  });

  // socket listeners
  socket.on('new user', (username) => {
    console.log(`✋ ${username} has joined the chat! ✋`);
    // Add the new user to the online users div
    $('.usersOnline').append(`<div class="userOnline">${username}</div>`);
  });

  // Output the new message
  socket.on('new message', (data) => {
    $('.messageContainer').append(`
      <div class="message">
        <p class="messageUser">${data.sender}: </p>
        <p class="messageText">${data.message}</p>
      </div>
    `);
  });

  socket.on('get online users', (onlineUsers) => {
    // You may have not have seen this for loop before. It's syntax is for(key in obj)
    // Our usernames are keys in the object of onlineUsers.
    console.log('inside get online users client side');
    for (username in onlineUsers) {
      $('.usersOnline').append(`<p class="userOnline">${username}</p>`);
    }
  });
});
