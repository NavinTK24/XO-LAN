const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'testing','index4.html'));
});

var count = 0;

io.on('connection', (socket) => {
    console.log("Player connected: "+socket.id);
    console.log('Clients connected:', io.engine.clientsCount);

    //Decides and emits the data to the client
    socket.on('playerChoice', (data) => {
        const player = (count%2 === 0)? 'X' : 'O';
        io.emit('updatedDiv', {
            id: data.id,
            value: Number(data.value),
            player: player,
            count: count+1,
        });
        
        count++;
        
    });

    //emits reset signal when button is pressed
    socket.on('resetEverything', () => {
        console.log(`Reset requested by ${socket.id}`);
        count = 0;
        io.emit('resetBoardForAll');
    });
});

http.listen(3004, () => {
    console.log("Server running at localhost:3004");
});
