var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    //console.log('id: ' + socket.id)
    
    // socket.broadcast.emit('control', {
    //     type: 'connect',
    //     value: socket.id,
    //     color: 'secondary',
    // })

    var clients =[];

    socket.on('storeClientInfo', function (data) {

        var clientInfo = new Object();
        clientInfo.customId         = data.customId;
        clientInfo.clientId     = socket.id;
        clients.push(clientInfo);

        console.log(data)

        socket.broadcast.emit('control', {
            type: 'connect',
            value: socket.id,
            color: 'secondary',
            clientID: clientInfo.customId,
            video: null
        })

    });

    socket.on('disconnect', function(){
        // console.log('user disconnected');
        // io.emit('disconnect', 'desconectado')
        socket.broadcast.emit('control', {
            type: 'disconnect',
            value: socket.id 
        })
    });

    socket.on('chat message', function(msg){
        // console.log('message: ' + msg);
        // io.emit('chat message', msg);
        // io.of('myNamespace').to(msg).emit('chat message', 'message');
        io.to(`${msg}`).emit('chat message', 'I just met you');
    });

    socket.on('play', function(data){
        io.to(`${data.id}`).emit('play', 'start play');
    });

    socket.on('stop', function(data){
        io.to(`${data.id}`).emit('stop', 'stop play');
    });

    socket.on('pause', function(data){
        io.to(`${data.id}`).emit('pause', 'pause play');
    });

    socket.on('play_video', function(data){
        io.to(`${data.id}`).emit('play_video', data);
    })

    socket.on('fullscreen', function(data){
        io.to(`${data.id}`).emit('fullscreen', 'fullscreen');
    })

    // socket.on('control', function(msg){
    //     io.emit('control', msg);
    // })

});

http.listen(3001, function(){
  console.log('listening on *:3001');
});