import express from 'express'
import http from 'http'
import { Server } from 'socket.io'


const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})

app.get('/', (req, res) => {
    res.send("<h1>Hello World</h1>")
})


io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`)

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`)
    })

    socket.on('send-message', (msg, room) => {
        if (room === "") {
            console.log(`Send-Message to All : ${msg}`)
            io.emit('receive-message', msg)
        }
        else {
            console.log(`Send Message ${msg} to Room ${room}`)
            io.in(room).emit('receive-message', msg)
        }
    })

    socket.on('join-room', (room) => {
        console.log(`User ${socket.id} joins Room ${room}`)
        socket.join(room)
    })


})


const PORT: number = 3500

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})
