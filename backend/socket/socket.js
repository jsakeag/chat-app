import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin:['http://localhost:3000'],
        methods:['GET','POST']
    }
})

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

const userSocketMap = {}; // {userId: socketId}

io.on('connection', (socket) => {
    console.log("user has connected", socket.id);

    //add user to socketmap when connecting
    const userId = socket.handshake.query.userId;
    if (userId != "undefined") userSocketMap[userId] = socket.id;

    // io.emit() is an emitter for the connected clients; sends events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    // socket.on is a listener for the events; can be used on both client and server side
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        //delete user from socketmap and update online users when disconnecting
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })
})
export {app, io, server}