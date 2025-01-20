import { createServer } from "http";
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'
import PocketBase from 'pocketbase';


const pb = new PocketBase('http://127.0.0.1:8090');



const port = parseInt(process.env.PORT || '3012', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

let chatMessagesHistory = []

app.prepare().then(() => {

    const httpServer = createServer(handle)
    const io = new Server(httpServer)


    io.on("connection", (socket) => {

        console.log("Hello World from Socket.io at ")
        console.log(chatMessagesHistory)

        socket.on('clientConnected', () => {
            socket.emit('sendChatMessagesHistory', chatMessagesHistory)
        })

        socket.on("sendMessage", (chatMessage) => {
            console.log(chatMessage)
            chatMessagesHistory.push(chatMessage)
            pb.collection('chat_messages').create({
                message: chatMessage.message,
                guestName: chatMessage.guestName,
                reactions: chatMessage.reactions,
                avatarUrl: chatMessage.author.avatarUrl,
                author: chatMessage.author.id,
                timestamp: chatMessage.timestamp,
                uuid: chatMessage.uuid
            })
            io.emit("receiveMessage", chatMessage)
            console.log(chatMessagesHistory)
        })

        socket.on("updateUserAvatar", (newUser) => {
            if (chatMessagesHistory) {
                chatMessagesHistory = chatMessagesHistory.map((chatMessage) => {
                    if (chatMessage.author.id === newUser.id) {
                        return {...chatMessage, author: newUser}
                    }
                    return chatMessage
                })
            }
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