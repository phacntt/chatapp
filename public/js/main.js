const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector(`.chat-messages`);
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


// Get username and room from URL (seemore: CDNjs)
const {
  username,
  room
} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

console.log(username, room);

const socket = io();

// join chatRoom
socket.emit('joinChat', {
  username,
  room
})

socket.on('roomUser', ({users, room}) => {
  outputRoomName(room);
  outputUser(users);
});

// Message server
socket.on('message', message => {
  console.log(message)
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// get value input chat
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // const msg = document.getElementById('msg').value;
  const msg = e.target.elements.msg.value; //e -> target -> element -> id -> value = document.get...Id().value

  socket.emit('chatMessage', msg)

  // Clear input when submit and focus input
  e.target.elements.msg.value = ``;
  e.target.elements.msg, focus();
});

// output
function outputMessage(msg) {
  const div = document.createElement('div');
  div.classList.add('message');

  div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p><p class="text">${msg.text}</p>`;

  document.querySelector('.chat-messages').appendChild(div);

}
// Add room name to DOM
function outputRoomName(room) {
  roomName.innerHTML = room;

}

// Add user to DOM
function outputUser(users) {
  userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;

}