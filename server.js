let express = require('express');
let app = express();
let cors = require('cors');
let bodyParser = require('body-parser');
let jwt = require('./_helpers/jwt');
let errorHandler = require('./_helpers/error-handler');
let socketio = require('socket.io');

let { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
let router = require('./router');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/posts', require('./posts/posts.controller'));


// global error handler
app.use(errorHandler);

// start server
let port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 9000;
let server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

let io = socketio(server);

io.on('connect', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if(error) return callback(error);

        socket.join(user.room);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
    })
});
