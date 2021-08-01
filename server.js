const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket =>{
    socket.emit('message', 'Welcome to Chatapp');
    
    //Broadcast when a user connect
    socket.broadcast.emit('message', 'A user join the chat');

    //Disconnect when user leave
    socket.on('disconnect', () => {
        io.emit('message', 'User leave the chat')
    });

    //listen for chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', msg);
    });
});

const PORT = 8080 || process.env.PORT;



server.listen(PORT, () => console.log('Server running on port ' + PORT));