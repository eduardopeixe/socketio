var express = require('express')
var path = require('path')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

var port = 8080
let users = []

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', function(socket) {
  console.log('new connection made')

  //Join privat room
  socket.on('join-private', data => {
    socket.join('private')
    console.log(data.nickname, 'just joined private')
  })

  socket.on('private-chat', data => {
    console.log('private chat', data.message)
    socket.broadcast.to('private').emit('show-message', data.message)
  })

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

  //Send like to the a user
  socket.on('send-like', data => {
    console.log('sent like', data, data.like)
    socket.broadcast.to(data.like).emit('user-liked', data)
  })

  //Disconnect from sockjet
  socket.on('disconnect', () => {
    console.log('disconnection user')
    users = users.filter(item => item.nickname !== socket.nickname)
    io.emit('all-users', users)
  })
})

server.listen(port, function() {
  console.log('Listening on port ' + port)
})
