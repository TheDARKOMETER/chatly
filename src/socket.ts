"use client"

import { io, Socket } from "socket.io-client"
import { Transport } from "engine.io-client"
const socket: Socket = io()
export { io, socket, Transport }
