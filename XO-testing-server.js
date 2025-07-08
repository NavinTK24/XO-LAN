const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'XO-testing.html'));
});

io.on('connection', (socket) => {
    console.log("Player connected: "+socket.id);
    var count = 0;
    socket.on('playerChoice', (data) => {
        const player = (count%2 === 0)? 'X' : 'O';
        io.emit('updatedDiv', {
            id: data.id,
            value: Number(data.value),
            player: player,
        });
        count++;
    });
});

http.listen(3004, () => {
    console.log("Server running at localhost:3004");
});
