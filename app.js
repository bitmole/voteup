var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app, {log: false})
  , fs = require('fs')

var port = process.env.PORT || 5000
app.listen(port, function() {
    console.log('Listening on ' + port);
});

function handler (req, res) {
  fs.readFile(__dirname + req.url, function (err, data) {
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
        vote.rock ? this.rock++ : this.suck++;
        return this;
    }
}

io.sockets.on('connection', function (socket) {

  socket.on('init', function (vote) {
    io.sockets.emit('current', results);
  });

  socket.on('vote', function (vote) {
    console.log(vote);
    io.sockets.emit('updated', results.update(vote));
  });

});
