const socket = io();
let room;

function init() {
    const username = sessionStorage.getItem('username');
    const roomSelect = document.querySelector('#room');
    const roomSubmit = document.querySelector('#connect-btn');
    const formSubmit = document.querySelector('.wrapper');
    const chatSpace = document.querySelector('.chat-space');
    const leaveRoom = document.querySelector('#leave-btn');
    const sendButton = document.querySelector('#send-btn');
    const messageInput = document.querySelector('#message-input');
    const chatMessages = document.querySelector('#chat-messages');
    const messageList = document.querySelector('#message');
    const chatHeader = document.querySelector('.chat-header h2'); // Select the h2 element in chat header

    // Event listener for the "Enter" button
    roomSubmit.addEventListener('click', () => {
        room = roomSelect.value;
        if (room === "Select room" || room.trim() === "") {
            roomSelect.style.borderColor = 'red';
            roomSelect.focus();
            return;
        }

        // Hide the form and display the chat space
        formSubmit.style.display = 'none';
        chatSpace.style.display = 'block';

        // Update the chat header with the room name
        chatHeader.textContent = `Chat - ${roomSelect.options[roomSelect.selectedIndex].text}`;

        // Emit join event with room and username
        socket.emit('join', { room, username });
    });

    // Event listener for "Send" button
    sendButton.addEventListener('click', () => sendMessage());

    // Handle sending message with "Enter" key
    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        socket.emit('message', { room, message });
        messageInput.value = "";
    }

    // Event listener for the "Leave" button
    leaveRoom.addEventListener('click', () => {
        socket.emit('leave', { room });
        sessionStorage.setItem('username', username);
        window.location.href = '/';
    });

    // Listen for incoming messages from server
    socket.on('message', (data) => {
        const messageElement = document.createElement('li');
        messageElement.classList.add(data.username === 'System' ? 'system-message' : (data.username === username ? 'my-message' : 'other-message'));
        messageElement.innerHTML = data.username === username ? `<span>You</span>:<br> ${data.message}` : `<span class="username">${data.username}</span>:<br> ${data.message}`;
        messageList.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}
