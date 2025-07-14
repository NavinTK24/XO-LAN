const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'testing','index4.html'));
});

var count = 0;
var Xclient = '';
var Oclient = '';

io.on('connection', (socket) => {
    console.log("Player connected: "+socket.id);
    console.log('Clients connected:', io.engine.clientsCount);

    if(count === 0) {
        if(!Xclient) {
            Xclient = socket.id;
        } else if (!Oclient) {
            Oclient = socket.id;
        }
    }
    
    //Decides and emits the data to the client
    socket.on('playerChoice', (data) => {
        const player = (count%2 === 0)? 'X' : 'O';

        if (io.engine.clientsCount === 1 || Oclient === '') {
            io.emit('updatedDiv', {
                id: data.id,
                value: Number(data.value),
                player: player,
                count: count+1,
            }); 
            count++;
        }
        else if((io.engine.clientsCount === 1 || socket.id === Xclient && player === 'X') || (socket.id === Oclient && player === 'O')) {
            io.emit('updatedDiv', {
                id: data.id,
                value: Number(data.value),
                player: player,
                count: count+1,
            }); 
            count++;
        } else {
            console(`Invalid move attempt by ${socket.id}`);
        }

        
    });

    //emits reset signal when button is pressed
    socket.on('resetEverything', () => {
        console.log(`Reset requested by ${socket.id}`);
        count = 0;
        io.emit('resetBoardForAll');
    });
    
    socket.on('disconnect', () => {
        console.log("Player disconnected: "+socket.id);
        // Reset roles if one of the players leaves
        if(socket.id === Xclient || socket.id === Oclient) {
            console.log("Resetting game due to disconnect");
            count = 0;
            Xclient = '';
            Oclient = '';
            io.emit('resetBoardForAll');
        }
    });
});

http.listen(3004, () => {
    console.log("Server running at localhost:3004");
});
