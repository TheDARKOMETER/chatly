'use client'

import { io, socket, Transport } from "../socket"
import { useState, useEffect, useOptimistic, use } from "react";
import { AddReaction } from './actions'
import SendIcon from '@mui/icons-material/Send';
import { AccountCircle, AddReaction as AddReactionIcon, Flag } from "@mui/icons-material";
import styles from './homepage.module.css'
import { JsxElement } from "typescript";

export default function Home() {

  const [isConnected, setIsConnected] = useState(socket.connected)
  const [transport, setTransport] = useState("N/A")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isReacting, setIsReacting] = useState(false)
  const [isFlagging, setIsFlagging] = useState(false)
  const [user, setUser] = useState<User>({
    id: 12,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    username: "TestUser",
    email: "t3gQx@example.com",
  })
  const [chatMessage, setChatMessage] = useState<ChatMessage>({
    message: "Test",
    username: "TestUser",
    reactions: [],
    author: user,
    timestamp: Date.now(),
  })

  useEffect(() => {
    if (socket.connected) {
      onConnect()

      socket.emit("hello", "world")
    }

    function onConnect(): void {
      setIsConnected(true)
      setTransport(socket.io.engine.transport.name)

      socket.io.engine.on("upgrade", (transport: Transport) => {
        setTransport(transport.name)
      })
    }

    function onDisconnect(): void {
      setIsConnected(false)
      setTransport("N/A")
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
    }
  }, [])

  function emitMessage(): void {
    console.log("Emitting")
    socket.emit('emitMessage', chatMessage)
  }


  const dismissDropdownOnClickOutside = (e: React.MouseEvent<HTMLElement>): void => {
    let clickedElement: HTMLElement = e.target as HTMLElement
    let reactionButton: HTMLElement = document.getElementById("react-button") as HTMLElement
    let reactionMenu: HTMLElement = document.getElementById('reaction-menu') as HTMLElement
    let flagButton: HTMLElement = document.getElementById("flag-button") as HTMLElement
    let flagMenu: HTMLElement = document.getElementById('flag-menu') as HTMLElement

    if (!reactionButton.contains(clickedElement) && !reactionMenu.contains(clickedElement)) {
      setIsReacting(false)
    }

    if (!flagButton.contains(clickedElement) && !flagMenu.contains(clickedElement)) {
      setIsFlagging(false)
    }

  }

  return (
    <main onClick={dismissDropdownOnClickOutside} className={`flex flex-col mx-36 items-center justify-between mt-24 text-white ${styles['chat-window']}`}>
      <div id="chatBox" className="chat-box-container w-full h-5/6 rounded-md shadow-lg border gap-y-2 rounded-md border-slate-500 flex justify-end flex-col p-2">
        <div className="chat-box p-2 overflow-y-auto flex flex-col w-full h-full bg-slate-800 resize-none rounded-sm" >
          <ChatMessage
            message="Test"
            username="TestUser"
            author={user}
            reactions={[]}
            timestamp={Date.now()}
          />
        </div>
        <div className="flex flex-row h-1/6 gap-x-2">
          <textarea className="chat-input focus:outline-slate-600 focus:outline-2 focus:outline w-full bg-slate-800 resize-none rounded-sm w-11/12 p-2" placeholder="Enter a message" />
          <button onClick={emitMessage} className="w-1/12 bg-slate-600 rounded-sm"><SendIcon /></button>
        </div>
      </div>
    </main >
  );




  function ChatMessage(props: ChatMessage): JSX.Element {

    const toggleReactionMenu = () => {
      setIsReacting(isReacting => !isReacting)
    }


    const toggleFlagMenu = () => {
      setIsFlagging(isFlagging => !isFlagging)
    }

    return (
      <div className="chat-message items-center flex flex-row justify-between items-center bg-slate-900 p-2 rounded-lg">
        <div className="flex flex-row items-center">
          <span className="flex items-center gap-x-1 bg-slate-600 px-3 py-1 rounded-xl mr-2">
            <AccountCircle />{props.username}
          </span>{props.message}
        </div>
        <div className="text-slate-600 text-sm mr-2 gap-x-2 flex">

          <div className={`chat-action-button-wrapper relative`}>
            <button id="flag-button" onClick={toggleFlagMenu} className="focus:outline-slate-400 focus:outline outline-1 rounded-lg relative">
              <Flag />
            </button>
            <FlagMenu />
          </div>

          <div className={`chat-action-button-wrapper relative`}>
            <button id="react-button" onClick={toggleReactionMenu} className="focus:outline-slate-400 focus:outline outline-1 rounded-lg relative">
              <AddReactionIcon />
            </button>
            <ReactionMenu />
          </div>

        </div>
      </div>
    )
  }

  function FlagMenu() {
    return (
      <div id="flag-menu" className={`menu rounded-md shadow-lg border border-slate-600 w-16 bg-slate-700 flex flex-col absolute text-white ${styles['chat-flag-action-dropdown']} ${isFlagging ? 'block' : 'hidden'}`}>
        <ul className="text-xs text-center">
          <button><li className={styles['chat-action-dropdown-items']}>Report User</li></button>
        </ul>
      </div>
    )
  }

  function ReactionMenu() {
    const emojis: string[] = ['😊', '😔', '👍', '❤️', '😠', '👎', '👏']

    return (
      <div id="reaction-menu" className={`menu rounded-md shadow-lg border border-slate-600 justify-center w-32 py-3 bg-slate-700 flex flex-row absolute text-white ${styles['reactions-dropdown']} ${isReacting ? 'block' : 'hidden'}`}>
        <ul className="text-xs flex flex-row overflow-hidden">
          {
            emojis.map((emoji, index) => (
              <button key={index} onClick={() => { }}>
                <li>{emoji}</li>
              </button>
            ))
          }
        </ul>
      </div>
    )
  }
}


export interface ChatMessage {
  message: string;
  username: string;
  avatarUrl?: string;
  reactions: string[];
  author: User;
  timestamp: number;
}

export interface User {
  id: number;
  avatarUrl: string;
  username: string;
  email: string;
}