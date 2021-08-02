// path get address folder
const path = require('path');
// http is protocol and exchange information
const http = require('http');
// express is framework nodejs
const express = require('express');
// declare socketio
const socketio = require('socket.io');

const app = express();
// create server by http with framework express
const server = http.createServer(app);
// call socketio use server
const io = socketio(server);

const formatMessage = require(`./utils/message`);
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require(`./utils/users`);


// Put static address folder, it containt all file html, css, js,...
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chatapp Bot';

// call method "on" in socket with 2 parameter. (p1, p2) with p1 is keyword or something, but i know it process work follow
// event ex: connection => client connect or access app, ...; p2 is function and have 1 variable use arrow function
io.on('connection', socket => {
    socket.on('joinChat', ({
        username,
        room
    }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room)

        //method emit will notification all user access know it
        socket.emit('message', formatMessage(botName, `Welcome ${user.username} to Chatapp`));

        //Broadcast when a user connect
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} join the chat`));

        // Send user and room
        io.to(user.room).emit('roomUser', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

        //Disconnect when user leave
        socket.on('disconnect', () => {
            const user = userLeave(socket.id);

            if (user) {
                io.to(user.room).emit('message', formatMessage(botName, `${user.username} leave the chat`));

                // Send user and room
                io.to(user.room).emit('roomUser', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                });
            }

        });
    });

    //listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });


});

const PORT = 8080 || process.env.PORT;



server.listen(PORT, () => console.log('Server running on port ' + PORT));