const chatForm = document.getElementById('chat-form');

const socket = io();

// Message server
socket.on('message', message => {
  console.log(message)
  outputMessage(message);
});

// get value input chat
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value; //e -> target -> element -> id -> value

  socket.emit('chatMessage', msg)
});

// output
function outputMessage(msg) {
  const div = document.createElement('div');
  div.classList.add('message');
  
  div.innerHTML = `<p class="meta">Pha <span>9:12 pm</span></p><p class="text">${msg}</p>`;

  document.querySelector('.chat-messages').appendChild(div);
}