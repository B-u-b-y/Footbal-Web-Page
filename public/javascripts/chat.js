const socket = io();
let room;

function init() {
    const username = sessionStorage.getItem('username');
    console.log("username: ", username);
    const room_submit = document.querySelector('#connect-btn');
    const form_submit = document.querySelector('.wrapper');
    const chat_space = document.querySelector('.chat-space');
    const leave_room = document.querySelector('#leave-btn');
    const send_button = document.querySelector('#send-btn');
    const room_input = document.querySelector('#room');
    const message_input = document.querySelector('#message-input'); // Get the message input field
    const chat_messages = document.querySelector('#chat-messages'); // Reference to the chat messages container
    const message_list = document.querySelector('#message');

    // Event listener for the "Enter" button
    room_submit.addEventListener('click', () => {
        room = room_input.value; // Get the value of the room input field
        if (room.trim() === "") {
            room_input.placeholder = 'Enter a room name'; // Fixed the reference to room_input
            room_input.style.color = 'red';
            return;
        }

        form_submit.style.display = 'none'; // Hide the form
        chat_space.style.display = 'block'; // Show the chat space

        // Emit the join event with the room and username
        socket.emit('join', { room, username });
    });

    // Event listener for the "Send" button
    send_button.addEventListener('click', () => {
        const message = message_input.value; // Get the message from the input
        if (message.trim() === "") {
            return; // Prevent sending empty messages
        }

        // Emit the message to the server
        socket.emit('message', { room, message });
        message_input.value = ""; // Clear the input field after sending
    });

    message_input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const message = message_input.value; // Get the message from the input
            if (message.trim() === "") {
                return; // Prevent sending empty messages
            }

            // Emit the message to the server
            socket.emit('message', { room, message });
            message_input.value = ""; // Clear the input field after sending
        }
    });

    // Event listener for the "Leave" button
    leave_room.addEventListener('click', () => {
        socket.emit('leave', { room });
        sessionStorage.setItem('username', username); // Store username in session storage
        window.location.href = '/index.html'; // Redirect to the main page after leaving
    });

    // Listen for messages from the server
    socket.on('message', (data) => {
        const messageElement = document.createElement('li'); // Create a <li> element for each message

        if (data.username === 'System') {
            messageElement.classList.add('system-message'); // Add a class for system messages
            messageElement.innerHTML = `${data.message}`; // Display system messages as they are
        } else if (data.username === username) {
            messageElement.classList.add('my-message'); // Add a class for the user's message
            messageElement.innerHTML = `<span class="you">You</span>:<br> ${data.message}`; // Prefix "You:" with a span
        } else {
            messageElement.classList.add('other-message'); // Add a class for other users' messages
            messageElement.innerHTML = `<span class="username">${data.username}</span>:<br> ${data.message}`; // Wrap username in a span
        }

        message_list.appendChild(messageElement); // Append the new message to the <ul>
        chat_messages.scrollTop = chat_messages.scrollHeight; // Scroll to the bottom of the chat

        message_input.focus();
    });
}
