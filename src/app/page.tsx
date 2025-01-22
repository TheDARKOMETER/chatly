'use client'

import { io, socket, Transport } from "../socket"
import { useState, useEffect, useOptimistic, useRef, memo, ReactElement } from "react";
import { AddReaction } from './actions'
import SendIcon from '@mui/icons-material/Send';
import { Avatar } from "@mui/material";
import { AccountCircle, AddReaction as AddReactionIcon, Flag } from "@mui/icons-material";
import styles from './homepage.module.css'
import { v4 as uuid } from 'uuid'
import { useAuth } from "./authcontext";
import { JsxElement } from "typescript";
import { ChatMessage, User } from "@/app/types"

export default function Home() {

  const [isConnected, setIsConnected] = useState(socket.connected)
  const [transport, setTransport] = useState("N/A")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const authContext = useAuth()
  const { user, getAvatarUrl } = authContext!
  const endOfChatRef = useRef<HTMLDivElement>(null)
  const [author, setAuthor] = useState<User>({
    id: '',
    avatarUrl: "",
    username: "",
    email: "t3gQx@example.com",
    created: new Date(),
  })


  const chatInputRef = useRef<HTMLTextAreaElement>(null)
  const [currentInputMessage, setCurrentInputMessage] = useState<ChatMessage | null>(null)

  const emitMessage = (): void => {
    setCurrentInputMessage({
      message: chatInputRef.current?.value as string,
      guestName: author.username,
      reactions: [],
      author: user,
      timestamp: new Date(Date.now()),
      uuid: uuid(),
    })
  }


  useEffect(() => {
    if (currentInputMessage) {
      if (chatInputRef.current) {
        chatInputRef.current.value = ""
      }
      socket.emit('sendMessage', currentInputMessage)
      setCurrentInputMessage(null)
    }
  }, [currentInputMessage])


  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_POCKETBASE_AVATAR_URL)
    if (socket.connected) {
      onConnect()
    }

    function onReceiveMessage(message: ChatMessage): void {
      setMessages((messages) => [...messages, message])
    }


    function onConnect(): void {
      setIsConnected(true)
      setTransport(socket.io.engine.transport.name)

      socket.emit("clientConnected")


      socket.once('sendChatMessagesHistory', (chatMessagesHistory: ChatMessage[]) => {
        console.log(chatMessagesHistory)
        setMessages((messages) => [...messages, ...chatMessagesHistory])
      })

      socket.off("receiveMessage").on("receiveMessage", onReceiveMessage)

      socket.io.engine.on("upgrade", (transport: Transport) => {
        setTransport(transport.name)
      })

      // Set user as the client socket id as guest
      if (!user) {
        setAuthor({
          id: socket.id as string,
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          username: socket.id as string,
          email: socket.id as string,
          created: new Date(),
        })
      }


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
      socket.off("receiveMessage", onReceiveMessage);

      document.removeEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          emitMessage()
        }
      })
    }
  }, [])

  useEffect(() => {
    if (endOfChatRef.current) {
      endOfChatRef.current.scrollIntoView({ behavior: "smooth", block: 'nearest' })
    }
  }, [messages])

  const ChatMessageList = memo(({ data }: { data: ChatMessage[] }): JSX.Element => {
    return (
      <div className="overflow-clip z-50">
        {data.map((message: ChatMessage, index: number) => {
          let isLastItem = index + 1 === data.length

          return (<ChatMessage key={message.uuid}
            message={message.message}
            guestName={message.guestName}
            author={message.author}
            reactions={message.reactions}
            timestamp={message.timestamp}
            uuid={message.uuid}
            isLastItem={isLastItem}
          />)
        }
        )}
      </div>
    )
  })

  return (
    <main className={`mt-8 text-white ${styles['chat-window']}`}>
      <div id="chatBox" className="overflow-visible chat-box-container w-full h-5/6 rounded-md shadow-lg border gap-y-2 border-slate-500 flex justify-end flex-col p-2">
        <div className="chat-box overflow-y-auto flex flex-col w-full h-full bg-slate-800 resize-none rounded-sm" >
          <ChatMessageList data={messages} />
          <div ref={endOfChatRef} className="relative" id="end-of-chat" />
        </div>
        <div className="flex flex-row h-1/6 gap-x-2">
          <textarea ref={chatInputRef} onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              if (chatInputRef.current?.value === "" && chatInputRef.current) {
                chatInputRef.current.placeholder = "Message must be more than 1 character long"
                return
              }
              emitMessage()
            }
          }
          }
            className="chat-input focus:outline-slate-600 focus:outline-2 focus:outline bg-slate-800 resize-none rounded-sm lg:w-11/12 w-4/5 p-2" placeholder="Enter a message" />
          <button onClick={emitMessage} className="lg:w-1/12 w-1/5 bg-slate-600 rounded-sm"><SendIcon /></button>
        </div>
      </div>
    </main >
  );




  function ChatMessage(props: ChatMessage & { isLastItem: boolean }): JSX.Element {
    const [isReacting, setIsReacting] = useState(false)
    const [isFlagging, setIsFlagging] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState('')
    const reactionButton = useRef<HTMLButtonElement>(null)
    const reactionMenu = useRef<HTMLDivElement>(null)
    const flagButton = useRef<HTMLButtonElement>(null)
    const flagMenu = useRef<HTMLDivElement>(null)
    const toggleReactionMenu = () => {
      console.log("toggling reaction menu", isReacting)
      setIsReacting(isReacting => !isReacting)
    }


    const toggleFlagMenu = () => {
      setIsFlagging(isFlagging => !isFlagging)
    }

    const dismissDropdownOnClickOutside = (e: MouseEvent): void => {
      let clickedElement: HTMLElement = e.target as HTMLElement
      if (!clickedElement) return


      if (reactionButton.current && reactionMenu.current && flagButton.current && flagMenu.current) {
        if (!reactionButton.current.contains(clickedElement) && !reactionMenu.current.contains(clickedElement) && isReacting) {
          setIsReacting(false)
        }

        if (!flagButton?.current.contains(clickedElement) && !flagMenu?.current.contains(clickedElement) && isFlagging) {
          setIsFlagging(false)
        }
      }

    }

    useEffect(() => {
      document.body.addEventListener('click', dismissDropdownOnClickOutside)
      return () => document.body.removeEventListener('click', dismissDropdownOnClickOutside)
    })

    const parent: HTMLElement | null = document.getElementById('chat-messager-container')
    const child: HTMLElement | null  = document.getElementById('text-wrapper')


    return (
      <div id="chat-messager-container" className="w-full chat-message flex flex-row justify-between items-center bg-slate-900 p-2">
        <div className="flex flex-row items-center">
          <span className="shrink-0 flex h-16 items-center gap-x-1 px-3 py-1 rounded-xl mr-3">
            {((props.author?.avatarUrl === null || !props.author?.avatarUrl) ? <Avatar sx={{ width: 32, height: 32 }} alt={props.guestName} />
              : <img src={props.author!.avatarUrl} className="w-8 h-8 rounded-full" />
            )}
            <span className="font-bold">{props.author?.username || props.guestName}</span>
          </span>
          <div id="text-wrapper" className="text-wrap break-all">
            {props.message}
          </div>
        </div>
        <div id="action-wrapper" className="text-slate-600 text-sm mr-2 gap-x-2 flex ml-2">
          <div className={`chat-action-button-wrapper relative`}>
            <button ref={flagButton} id="flag-button" onClick={toggleFlagMenu} className="focus:outline-slate-400 focus:outline outline-1 rounded-lg relative">
              <Flag />
            </button>
            <FlagMenu isLastItem={props.isLastItem} />
          </div>

          <div className={`chat-action-button-wrapper relative`}>
            <button ref={reactionButton} id="react-button" onClick={toggleReactionMenu} className="focus:outline-slate-400 focus:outline outline-1 rounded-lg relative">
              <AddReactionIcon />
            </button>
            <ReactionMenu isLastItem={props.isLastItem} />
          </div>

        </div>
      </div>
    )

    function FlagMenu(props: { isLastItem: boolean }) {
      return (
        <div ref={flagMenu} id="flag-menu" className={`overflow-hidden ${styles['dropdown-menu']} w-20 flex flex-col absolute text-white ${!props.isLastItem ? styles['chat-flag-action-dropdown'] : styles['chat-flag-action-dropdown-end-item']} ${isFlagging ? 'block' : 'hidden'}`}>
          <ul className="text-xs text-center">
            <button><li className={``}>Report User</li></button>
          </ul>
        </div>
      )
    }

    function ReactionMenu(props: { isLastItem: boolean }) {
      const emojis: string[] = ['😊', '😔', '👍', '❤️', '😠', '👎', '👏']

      return (
        <div ref={reactionMenu} id="reaction-menu" className={`${styles['dropdown-menu']} justify-center  flex flex-row absolute text-white ${!props.isLastItem ? styles['chat-reactions-dropdown-items'] : styles['chat-reactions-dropdown-items-end-item']} ${isReacting ? 'block' : 'hidden'}`}>
          <ul className="text-md flex flex-row overflow-hidden">
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


