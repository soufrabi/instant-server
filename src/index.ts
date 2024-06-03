import express from 'express'
import http from 'http'


const app = express()
const server = http.createServer(app)

app.get('/', (req, res) => {
    res.send("<h1>Hello World</h1>")
})

const PORT: number = 3500

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})
