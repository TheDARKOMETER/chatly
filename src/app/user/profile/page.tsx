"use client"
import { useAuth } from "@/app/authcontext"
import { Avatar } from "@mui/material"
import { AuthModel } from "pocketbase"
import { io } from 'socket.io-client'

import { FormEventHandler, ReactElement, useEffect, useRef, useState } from "react"



export default function page() {
    const socket = io();
    const authContext = useAuth()
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [hydrated, setIsHydrated] = useState(false)
    const [imageFile, setImageFile] = useState<File>()
    const [avatarUrl, setAvatarUrl] = useState('')
    const [showModal, setShowModal] = useState(false)
    useEffect(() => {
        if (authContext) {
            setIsHydrated(true)
        }
    }, [authContext])

    useEffect(() => {
        if (socket.connected) {
          onConnect();
        }
    
        function onConnect() {
          setIsConnected(true);
          setTransport(socket.io.engine.transport.name);
    
          socket.io.engine.on("upgrade", (transport) => {
            setTransport(transport.name);
          });
        }
    
        function onDisconnect() {
          setIsConnected(false);
          setTransport("N/A");
        }
    
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
    
        return () => {
          socket.off("connect", onConnect);
          socket.off("disconnect", onDisconnect);
        };
      }, []);
    

      useEffect(() => {
        console.log(transport)
      }, [transport])


    if (hydrated) {
        const user = authContext?.user
        const username = user?.username
        const email = user?.email
        const created = user?.created


        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault()

            if (imageFile) {
                const response = await authContext?.updateAvatar(user!.id, imageFile)
                setShowModal(true)
                const updatedUser = await authContext?.getUserRecord(authContext?.user!.id, null)
                console.log(updatedUser)
                socket.emit("updateUserAvatar", updatedUser)
            }
        }



        return (
            <>
                <div className={`flex gap-y-3 text-white flex-col bg-slate-900 border p-8 border-slate-500 rounded-md w-full h-128`} >
                    <h1 className="text-white text-2xl font-bold">Your profile:</h1>
                    <p>Profile picture: {((user!.avatarUrl === "") ? <Avatar sx={{ width: 64, height: 64 }} alt={username} />
                        : <img src={user!.avatarUrl} className="w-32 h-32 rounded-full" />
                    )}</p>
                    <p>Username: {username}</p>
                    <p>Email: {email}</p>
                    <p>Joined: {new Date(created!).toLocaleDateString()}</p>
                    <div className="flex flex-col gap-y-3">
                        <label>Choose a profile picture: </label>
                        {imageFile && <img src={imageFile ? URL.createObjectURL(imageFile) : ""} className="w-32 h-32" />}
                        <input accept="image/*" onChange={(e) => setImageFile(e.target.files![0])} type="file" />
                        <button type="submit" className="text-center border border-slate-500 w-20 rounded" onClick={handleSubmit} >Submit</button>
                    </div>
                </div>
                {showModal && <LoginModal message="Profile Updated" isSuccess={true} toggleModal={setShowModal} />}

            </>
        )
    } else {

        let displayFields = {
            username: "",
            email: ""
        }

        return (
            <div className={`flex gap-y-3 text-white flex-col bg-slate-900 border p-8 border-slate-500 rounded-md w-full h-128`} >
                <div className="flex flex-col gap-y-3">
                    <h1 className="text-white text-2xl font-bold">Your profile:</h1>
                    <div className="animate-pulse bg-slate-700 rounded-full w-3/12 h-8" />
                    <div className="animate-pulse bg-slate-700 rounded-full w-3/12 h-8" />
                    <div className="animate-pulse bg-slate-700 rounded-full w-32 h-32 " />
                    <div className="animate-pulse bg-slate-700 rounded-full w-3/12 h-8" />
                    <div className="animate-pulse bg-slate-700 rounded-full w-3/12 h-8" />
                    <div className="animate-pulse bg-slate-700 rounded-full w-3/12 h-8" />
                </div>
            </div>
        )
    }

}

function LoginModal(props: { message: string; isSuccess: boolean; toggleModal: React.Dispatch<React.SetStateAction<boolean>> }): ReactElement {
    return (
        <div id="modal-blur-background" className='fixed top-0 left-0 z-10 h-screen w-screen bg-gray/50 backdrop-blur-sm flex justify-center items-center'>
            <div className='bg-slate-900 justify-between p-4 flex flex-col text-white border border-slate-500 rounded-md w-1/3 h-32'>
                <p>Profile Updated</p>
                <button type="submit" className="text-center border border-slate-500 w-20 rounded" onClick={() => props.toggleModal(false)} >Ok</button>
            </div>
        </div>
    )
}