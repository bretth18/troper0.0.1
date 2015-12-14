//index.js
//brett henderson 2015

//TODO: SETUP MULTIPLE SERVERS ON MULTIPLE PORTS ON CONNECT ROOM CHOICE OFFERED.

// Setup basic express server

var express = require('express');
var app = express();
var fs = require('fs');
var https = require('https');
var options = {
  key: fs.readFileSync(__dirname + '/test/key.pem'),
  cert: fs.readFileSync(__dirname + '/test/cert.pem')
};
var server = require('https').createServer(options, app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
  //DJ KHALED, WE THE BEST.
  console.log('Ride Wit Me Thru The Journey of More Success');
  for (i = 0; i < 1; i++) {
    console.log('Another One');
  }
  if (console.log('Another One') == true){
    console.log('Another One')
  }
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;
    console.log('user added to socket')

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
    console.log('user-joined: ' + socket.username )
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
      console.log('user has left socket')
      console.log('user-left: ' + socket.username )
    }
  });
});
