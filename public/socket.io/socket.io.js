module.exports = (io) => {
    io.on('connection', (socket) => {
        // Store the username in the socket object
        socket.on('join', ({ room, username }) => {
            socket.join(room);
            socket.username = username; // Store the username in the socket object

            // Notify the room that a user has joined
            socket.to(room).emit('message', { username: 'System', message: `${username} joined the conversation` });
        });

        socket.on('message', ({ room, message }) => {
            // Emit the message to the room, including the username
            io.to(room).emit('message', { username: socket.username, message });
        });

        socket.on('leave', ({ room }) => {
            const username = socket.username; // Retrieve username from the socket
            socket.to(room).emit('message', { username: 'System', message: `${username} left the conversation` }); // Notify others
            socket.leave(room);
        });

        socket.on('disconnect', () => {
            const username = socket.username; // Retrieve username from the socket
            if (username) {
                const rooms = Object.keys(socket.rooms); // Get the rooms the socket is in
                rooms.forEach(room => {
                    socket.to(room).emit('message', { username: 'System', message: `${username} left the chat` }); // Notify others
                });
            }
        });
    });
};
