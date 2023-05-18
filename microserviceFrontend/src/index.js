const express = require('express')
const morgan = require('morgan');
const { dirname } = require('path');
const path = require('path');
const http = require ('http');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io= socketio(server);


// Settings
app.set('port', process.env.SERVER_PORT);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname,'public')));

io.on( 'connection', function( socket ) {
    console.log( 'User Connected' );

    socket.on('join', ({username, room})=>{
        socket.join(room);
    })

    socket.on('sendMessage', (item)=>{
        // We can see the number of clients connections.
        //console.log('io.sockets.server.engine.clientsCount: ', io.sockets.server.engine.clientsCount);
        let room=item.room;
        io.to(room).emit('sendMessage', item)
    })

    socket.on('sendNotification', (room)=>{
        let message='New Notification';
        io.to(room).emit('sendNotification', message)
    })
    
    socket.on('sendGroupnotification', (members)=>{
        members.forEach(element => {
            let room=element.id;
            io.to(room).emit('sendGroupnotification');
        });
    })

    socket.on('sendContact', (item)=>{
        let room=item.room_forNotification;
        io.to(room).emit('sendContact', item)
    })

    socket.on( 'disconnect', function() {
        console.log( 'User disconnected' );
    });
})

server.listen(app.get('port'), ()=>{   
    console.log(`Server on port ${app.get('port')}`);
});

