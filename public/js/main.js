const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// lấy dự liệu người dùng và room trên url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// gửi dữ liệu user và người dùng đến server 
socket.emit('joinRoom', { username, room });

// lấy dữ liệu rôm và user từ server trả về dom
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// nhận tin nhắn
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});


chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit('chatMessage', msg);
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});


function outputMessage(message) {
  const div = document.createElement('div')

  div.classList.add('message')
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div)
}

// thêm tên phòng vào Dom
function outputRoomName(room) {
  roomName.innerText = room;
}

// thêm user vào Dom
function outputUsers(users) {
  userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}

//hỏi trước khi thoát
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('muốn thoát k?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
