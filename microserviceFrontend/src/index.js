const express = require('express');
const morgan = require('morgan');
const { dirname } = require('path');
const path = require('path');
const http = require ('http');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io= socketio(server);
const fetchFunction = require('./app/functions/fetchFunction');
const logger = require("./logger");

// Settings
app.set('port', 3000);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname,'public')));

io.on( 'connection', function( socket ) {
    logger.log("info", 'User Connected');

    socket.on('join', (room)=>{
        socket.join(room);
    });
    socket.on('leave', (room)=>{
         socket.leave(room);
    });

    socket.on('sendMessage', async (it)=>{
    try{
        const token=it.token;
        const authFormData={token}
        const authResponse= await fetchFunction(authFormData, "http://authorization:4002/api/users/validation");
        if (authResponse.identification){ 
            const room=it.room;
            const formData={
                identification:authResponse.identification,
                room:room
            } 
            const user= await fetchFunction(formData, "http://backend:4001/api/users/userInformation");
            if (!user.found){
                const utcTime = new Date().toISOString(); 
                let item={
                    room,
                    id:authResponse.identification,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    message:it.message,
                    time:utcTime
                  }
                io.to(room).emit('sendMessage', item);
            }
        }        
    }catch(e){
        logger.log("error", e);
    } 
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
            
    socket.on('sendUpdateNotification', (members)=>{
        let message='New Update';
        members.forEach(element => {
            let room=element.id;
            io.to(room).emit('sendUpdateNotification', message);
        });
    });

    socket.on('sendUpdateEliminated', (item)=>{
        let members=item.members;
        let groupRoom=item.room;
        members.forEach(element => {
            let room=element.id;
            io.to(room).emit('sendUpdateEliminated', groupRoom);
        });
    });

    socket.on('sendContact', (item)=>{
        let room=item.room_forNotification;
        io.to(room).emit('sendContact', item)
    })

    socket.on('deleteContact', (item)=>{
        let room=item.room_forNotification;
        io.to(room).emit('deleteContact', room)
    })

    socket.on( 'disconnect', function() {
        logger.log("info", 'User disconnected');
    });
})

server.listen(app.get('port'), ()=>{   
    logger.log("info", `Server on port ${app.get('port')}`);
});

