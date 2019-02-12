var express = require('express')
var path = require('path')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

var port = 8080
const users = []

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', function(socket) {
  console.log('new connection made')

  //Show all users when fist logged on
  socket.on('get-users', () => {
    socket.emit('all-users', users)
  })

  //When new sockets joins
  socket.on('join', function(data) {
    socket.nickname = data.nickname
    users[socket.nickname] = socket

    const userObj = {
      nickname: data.nickname,
      socketid: socket.id
    }
    users.push(userObj)
    io.emit('all-users', users)
  })

  //Broadcast messages
  socket.on('send-message', data => {
    // socket.broadcast.emit('message-received', data)
    io.emit('message-received', data)
  })
})

server.listen(port, function() {
  console.log('Listening on port ' + port)
})
