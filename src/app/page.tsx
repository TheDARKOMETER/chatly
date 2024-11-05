'use client'

import { io, socket, Transport } from "../socket"
import { useState, useEffect, useOptimistic, useRef, memo, ReactElement } from "react";
import { AddReaction } from './actions'
import SendIcon from '@mui/icons-material/Send';
import { Avatar } from "@mui/material";
import { AccountCircle, AddReaction as AddReactionIcon, Flag } from "@mui/icons-material";
import styles from './homepage.module.css'
import { v4 as uuid } from 'uuid'
import { JsxElement } from "typescript";

export default function Home() {

  const [isConnected, setIsConnected] = useState(socket.connected)
  const [transport, setTransport] = useState("N/A")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [user, setUser] = useState<User>({
    id: '',
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    username: "",
    email: "t3gQx@example.com",
  })


  const chatInputRef = useRef<HTMLTextAreaElement>(null)
  const [currentInputMessage, setCurrentInputMessage] = useState<ChatMessage | null>(null)

  const emitMessage = (): void => {
    setCurrentInputMessage({
      message: chatInputRef.current?.value as string,
      username: user.username,
      reactions: [],
      author: user,
      timestamp: Date.now(),
      uuid: uuid(),
    })
  }


  useEffect(() => {
    if (currentInputMessage) {
      if (chatInputRef.current) {
        chatInputRef.current.value = ""
      }
      console.log("The chatMessage state has been set", currentInputMessage)
      socket.emit('sendMessage', currentInputMessage)
      setCurrentInputMessage(null)
    }
  }, [currentInputMessage])

  useEffect(() => {
    if (socket.connected) {
      onConnect()
    }

    function onConnect(): void {
      setIsConnected(true)
      setTransport(socket.io.engine.transport.name)

      socket.off("receiveMessage").on("receiveMessage", (message: ChatMessage) => {
        console.log("Receiving messages")
        setMessages((messages) => [...messages, message])
      })

      socket.io.engine.on("upgrade", (transport: Transport) => {
        setTransport(transport.name)
      })

      // Set user as the client socket id
      setUser({
        id: socket.id as string,
        avatarUrl: user.avatarUrl,
        username: socket.id as string,
        email: user.email,
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
      document.removeEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          emitMessage()
        }
      })
    }
  }, [])

  useEffect(() => {
    console.log(messages)
  }, [messages])




  return (
    <main onClick={() => { }} className={` mt-24 text-white ${styles['chat-window']}`}>
      <div id="chatBox" className="chat-box-container w-full h-5/6 rounded-md shadow-lg border gap-y-2 rounded-md border-slate-500 flex justify-end flex-col p-2">
        <div className="chat-box p-2 overflow-y-auto flex flex-col w-full h-full bg-slate-800 resize-none rounded-sm" >
          <ChatMessageList data={messages} />
        </div>
        <div className="flex flex-row h-1/6 gap-x-2">
          <textarea ref={chatInputRef} onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              emitMessage()
            }
          }
          }
            className="chat-input focus:outline-slate-600 focus:outline-2 focus:outline w-full bg-slate-800 resize-none rounded-sm w-11/12 p-2" placeholder="Enter a message" />
          <button onClick={emitMessage} className="w-1/12 bg-slate-600 rounded-sm"><SendIcon /></button>
        </div>
      </div>
    </main >
  );


  function ChatMessageList({ data }: { data: ChatMessage[] }): JSX.Element {
    return (
      <>
        {messages.map((message: ChatMessage, index: number) => {
          console.log("mapping")
          return (<ChatMessage key={index}
            message={message.message}
            username={message.username}
            author={message.author}
            reactions={message.reactions}
            timestamp={message.timestamp}
            uuid={message.uuid}
          />)
        }
        )}
      </>
    )
  }

  function ChatMessage(props: ChatMessage): JSX.Element {
    const [isReacting, setIsReacting] = useState(false)
    const [isFlagging, setIsFlagging] = useState(false)

    const toggleReactionMenu = () => {
      setIsReacting(isReacting => !isReacting)
    }


    const toggleFlagMenu = () => {
      setIsFlagging(isFlagging => !isFlagging)
    }

    const dismissDropdownOnClickOutside = (e: MouseEvent): void => {
      let clickedElement: HTMLElement = e.target as HTMLElement
      let reactionButton: HTMLElement | null = document.getElementById("react-button") as HTMLElement
      let reactionMenu: HTMLElement | null = document.getElementById('reaction-menu') as HTMLElement
      let flagButton: HTMLElement | null = document.getElementById("flag-button") as HTMLElement
      let flagMenu: HTMLElement | null = document.getElementById('flag-menu') as HTMLElement

      if (reactionButton && reactionMenu && !reactionButton?.contains(clickedElement) && !reactionMenu.contains(clickedElement)) {
        setIsReacting(false)
      }

      if (reactionButton && reactionMenu && !flagButton?.contains(clickedElement) && !flagMenu.contains(clickedElement)) {
        setIsFlagging(false)
      }
    }

    useEffect(() => {
      document.body.addEventListener('click', dismissDropdownOnClickOutside)
      return () => document.body.removeEventListener('click', dismissDropdownOnClickOutside)
    })

    return (
      <div className="chat-message items-center flex flex-row justify-between items-center bg-slate-900 p-2 rounded-lg">
        <div className="flex flex-row items-center">
          <span className="flex items-center gap-x-1 bg-slate-600 px-3 py-1 rounded-xl mr-2">
            <Avatar className="size-5" alt={props.username} src={props.avatarUrl} />{props.username}
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


    function FlagMenu() {
      return (
        <div id="flag-menu" className={`${styles['dropdown-menu']} w-20 flex flex-col absolute text-white ${styles['chat-flag-action-dropdown']} ${isFlagging ? 'block' : 'hidden'}`}>
          <ul className="text-xs text-center">
            <button><li className={``}>Report User</li></button>
          </ul>
        </div>
      )
    }

    function ReactionMenu() {
      const emojis: string[] = ['😊', '😔', '👍', '❤️', '😠', '👎', '👏']

      return (
        <div id="reaction-menu" className={`${styles['dropdown-menu']} justify-center w-32 flex flex-row absolute text-white ${styles['chat-reactions-dropdown-items']} ${isReacting ? 'block' : 'hidden'}`}>
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

}

export interface ChatMessage {
  message: string;
  username: string;
  avatarUrl?: string;
  reactions: string[];
  author: User;
  timestamp: number;
  uuid: string;
}

export interface User {
  id: string;
  avatarUrl: string;
  username: string;
  email: string;
}