import express from 'express'
import http from 'http'
import { Server } from 'socket.io'


type ResponseCallback = (responseStatusCode: number) => void
type JoinRoomResponseCallback = (responseStatusCode: number, anonId: string) => void
type ChatMessageData = {
    text: string,
    from: string,
    to: string,
}


const isProductionEnvironment: boolean = (process.env.NODE_ENV === 'production')
const isLogChatMessagesEnabled: boolean = !isProductionEnvironment

if (isLogChatMessagesEnabled) {
    console.log("Log Chat Messages Enabled")
} else {
    console.log("Log Chat Messages Disabled")
}

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: isProductionEnvironment ? process.env.WEBSITE_URL_DOMAIN : "http://localhost:3016"
    }
})

// app.get('/', (req, res) => {
//     res.send("<h1>Hello World</h1>")
// })

// map client to room
// to prevent a client from being in multiple rooms
const hm = new Map<string, string>

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`)

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`)
        hm.delete(socket.id)
    })

    socket.on('send-message', (msgText: string, room: string) => {
        room = room.trim()
        if (room === "") {
            // console.log(`Send-Message to All : ${msg}`)
            // io.emit('receive-message', msg)
            console.error(`Error : User ${socket.id} emitted event "send-message", but did not provide room number`)
        }
        else {
            const msg: ChatMessageData = {
                text: msgText,
                from: socket.id,
                to: "",
            }

            if (isLogChatMessagesEnabled) {
                console.log(`User ${socket.id} sent message ${JSON.stringify(msg)} to Room ${room}`)
            } else {
                console.log(`User ${socket.id} sent message to Room ${room}`)
            }
            io.in(room).emit('receive-message', msg)
        }
    })


    socket.on('join-room', (room: string, cb: JoinRoomResponseCallback) => {
        let previousRoom: string | null = hm.has(socket.id) ? hm.get(socket.id) : null
        if (previousRoom !== null && previousRoom === room) {
            console.log(`User ${socket.id} is already in room ${room}. No need to re-enter`)
        } else {
            if (previousRoom !== null) {
                socket.leave(previousRoom)
                hm.delete(socket.id)
                console.log(`User ${socket.id} leaves Room ${previousRoom}`)
            }
            socket.join(room)
            hm.set(socket.id, room)
            console.log(`User ${socket.id} joins Room ${room}`)
        }

        // execute callback on success
        cb(0, socket.id)

    })

    socket.on('leave-room', (cb: ResponseCallback) => {
        const currentRoom: string | null = hm.has(socket.id) ? hm.get(socket.id) : null
        if (currentRoom === null) {
            console.log(`User ${socket.id} is not any room. So, cannot leave`)
        } else {
            hm.delete(socket.id)
            console.log(`User ${socket.id} left room ${currentRoom}`)
        }

        // execute callback on success
        cb(0)

    })


})


const PORT: number = 3500

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})
