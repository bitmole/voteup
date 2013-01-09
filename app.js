var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app, {log: false})
  , fs = require('fs')

app.listen(3000);

function handler (req, res) {
  fs.readFile(__dirname + req.url,
      function (err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading ' + req.url);
        }

        res.writeHead(200);
        res.end(data);
      });
}

var results = {
    rock: 0,
    suck: 0,
    update: function(vote) {
        if (vote.rock) {
            this.rock += 1;
        } else {
            this.suck += 1;
        }

        return this;
    }
}

io.sockets.on('connection', function (socket) {

  io.sockets.emit('voted', results);

  socket.on('vote', function (vote) {
    console.log(vote);
    io.sockets.emit('voted', results.update(vote));
  });
});
