const express = require('express')
const path = require('path')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 8080

app.use(express.static(path.join(__dirname, "public")))

server.listen(port, () => {
    console.log('Server running on port', port)
})
