/* eslint-disable spaced-comment */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-undef */

$(document).ready(() => {
  $('#collapse-btn').click(() => {
    $('#rightPane').toggleClass('maximizedRightPane');
    $('#leftPane').toggleClass('hiddenLeftPane');
    $('#leftPane').children().toggleClass('hidden');
    $('#collapse-btn').toggleClass('hiddenCollapseBtn');
  });

  /********************
   *  SOCKET.IO BTNS  *
   ********************/

  // Connect to the socket.io server
  const socket = io.connect();

  // Sign up / enter chat
  $('#createUserBtn').click((e) => {
    e.preventDefault();
    currentUser = $('#usernameInput').val();
    if (currentUser.length > 0) {
      // Get the online users from the server
      socket.emit('get online users');
      // Emit to the server the new user
      socket.emit('new user', currentUser);
      $('.usernameForm').toggleClass('hidden');
      // Have the main page visible
      $('.mainContainer').css('display', 'flex');
    }
  });

  // Log out
  $('#logoutBtn').click(() => {
    console.log('trying to logout');
    socket.emit('log out', currentUser);
    $('.usernameForm').toggleClass('hidden');
    $('.mainContainer').css('display', 'none');
    // $('.mainContainer').toggleClass('hidden');
    // Client.emit('disconnect');
  });

  // Send message
  $('#sendChatBtn').click((e) => {
    e.preventDefault();
    // Get the client's channel
    const channel = $('.channel-current').text();
    // Get the message text value
    const message = $('#chatInput').val();
    // Make sure it's not empty
    if (message.length > 0) {
      console.log('emit new message from frontend');
      // Emit the message with the current user to the server
      socket.emit('new message', {
        sender: currentUser,
        message,
        channel,
      });
      $('#chatInput').val('');
    }
  });

  // Create new channel
  $('#newChannelBtn').click(() => {
    const newChannel = $('#newChannelInput').val();

    if (newChannel.length > 0) {
      // Emit the new channel to the server
      socket.emit('new channel', newChannel);
      $('#newChannelInput').val('');
    }
  });

  /*************************
   *  SOCKET.IO LISTENERS  *
   *************************/

  //  new user has entered
  socket.on('new user', (username) => {
    console.log(`✋ ${username} has joined the chat! ✋`);
    // Add the new user to the online users div
    $('.usersOnline').append(`<p class="userOnline">${username}</p>`);
  });

  // Add the new channel to the channels list (Fires for all clients)
  socket.on('new channel', (newChannel) => {
    $('.listOfChannels').prepend(`<div class="channel"># ${newChannel}</div>`);
  });

  // Make the channel joined the current channel. Then load the messages.
  // This only fires for the client who made the channel.
  socket.on('user changed channel', (data) => {
    $('.currentChannel').removeClass('currentChannel');
    $(`.channel:contains('${data.channel}')`).addClass('currentChannel');
    $('.message').remove();
    data.messages.forEach((message) => {
      $('.messageContainer').append(`
        <div class="message">
          <p class="messageUser">${message.sender}: </p>
          <p class="messageText">${message.message}</p>
        </div>
      `);
    });
  });


  // New Message Received
  socket.on('new message', (data) => {
    const currentChannel = $('.currentChannel').text();
    if (currentChannel == data.channel) {
      $('.messageContainer').append(`
        <div class="message">
          <p class="messageUser">${data.sender}: </p>
          <p class="messageText">${data.message}</p>
        </div>
      `);
    }
  });

  socket.on('get online users', (onlineUsers) => {
    // You may have not have seen this for loop before. It's syntax is for(key in obj)
    // Our usernames are keys in the object of onlineUsers.
    console.log('inside get online users client side');
    for (username in onlineUsers) {
      $('.usersOnline').empty();
      $('.usersOnline').append(`<p class="userOnline">${username}</p>`);
    }
  });

  // Refresh the online user list
  socket.on('user has left', (onlineUsers) => {
    $('.usersOnline').empty();
    for (username in onlineUsers) {
      $('.usersOnline').append(`<p class="userOnline">${username}</p>`);
    }
  });
});
