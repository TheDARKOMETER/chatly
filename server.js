import { createServer } from "http";
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'
import { create } from "domain";

const port = parseInt(process.env.PORT || '3012', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
let chatMessages = []

app.prepare().then(() => {

    const httpServer = createServer(handle)
    const io = new Server(httpServer)


    io.on("connection", (socket) => {
        console.log("Hello World from Socket.io at ")

        socket.on("sendMessage", (chatMessage) => {
            console.log(chatMessage)
            chatMessages.push(chatMessage)
            io.emit("receiveMessage", chatMessage)
        })

        
        

    })



    httpServer.once('error', () => {
        console.error("A servor error occured", err)
        process.exit(1)
    }).listen(port, () => {
        console.log(`> Server listening at http://localhost:${port} as ${dev ? ' development' : process.env.NODE_ENV}`)
    })

    // createServer((req, res) => {
    //     const parsedUrl = parse(req.url, true)
    //     handle(req, res, parsedUrl)
    // }).listen(port)


    // console.log(
    //     `> Server listening at http://localhost:${port} as ${dev ? ' development' : process.env.NODE_ENV}`
    // )
})