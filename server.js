let http = require('http');
let path = require('path');
let fs = require('fs');
let mimeTypes = {
    '.js' : 'text/javascript',
    '.html' : 'text/html',
    '.css' : 'text/css',
    '.png' : 'image/png',
    '.jpg' : 'image/jpeg',
    '.mp3' : 'audio/mpeg3',
    '.map' : 'application/octet-stream'
};

function handleRequest(request, response) {
    let lookup = (request.url === '/') ? '/index-source.html' : decodeURI(request.url);
    let file = lookup.substring(1, lookup.length);

    fs.exists(file, function(exists) {
        if (exists) {
            fs.readFile(file, function(err, data) {
                if (err) {
                    response.writeHead(500);
                    response.end('Server Error!');
                } else {
                    var headers = {'Content-type': mimeTypes[path.extname(lookup)]};
                    response.writeHead(200, headers);
                    response.end(data);
                }
            });
        } else {
            response.writeHead(404);
            response.end();
        }
    });
}

let server = http.createServer(handleRequest);
let io = require('socket.io')(server);
let display = [];

io.on('connection', function(socket) {
    console.log('Connection established');
    socket.emit('ack', {
        message: 'Connection established'
    });

    socket.on('move', function(data) {
        display.forEach(function(client) {
            client.emit('move', data);
        });
    });

    socket.on('rotate', function(data) {
        display.forEach(function(client) {
            client.emit('rotate', data);
        });
    });

    socket.on('display-connect', function(data) {
        display.push(socket);
    });

    socket.on('disconnect', function() {
        display = display.filter(d => d !== socket);
    });
});


server.listen(3000, function() {
    console.log('Server is listening');
});
