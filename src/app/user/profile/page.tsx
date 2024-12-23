"use client"
import { useAuth } from "@/app/authcontext"
import { Avatar } from "@mui/material"
import { AuthModel } from "pocketbase"
import { FormEventHandler, useEffect, useRef, useState } from "react"

export default function page() {

    const authContext = useAuth()
    const [hydrated, setIsHydrated] = useState(false)
    const [imageFile, setImageFile] = useState<File>()
    const fileInputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (authContext) {
            setIsHydrated(true)
        }
    }, [authContext])

    useEffect(() => {

    })

    useEffect(() => {
        console.log(fileInputRef.current?.value)
    }, [fileInputRef.current?.value])



    if (hydrated) {
        const user = authContext?.user
        const avatarUrl = user?.avatar
        const username = user?.username
        const email = user?.email
        const created = user?.created


        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault()

            if (imageFile) {
                authContext?.updateAvatar(user!.id, imageFile)
            }
        }

        return (
            <div className={`flex gap-y-3 text-white flex-col bg-slate-900 border p-8 border-slate-500 rounded-md w-full h-128`} >
                <h1 className="text-white text-2xl font-bold">Your profile:</h1>
                <p>Profile picture:             {((avatarUrl === "") ? <Avatar sx={{ width: 32, height: 32 }} alt={username} />
                    : <img src={avatarUrl} className="w-8 h-8 rounded-full" />
                )}</p>
                <p>Username: {username}</p>
                <p>Email: {email}</p>
                <p>Joined: {new Date(created!).toLocaleDateString()}</p>
                <div className="flex flex-col">
                    <label>Choose a profile picture: </label>
                    <img src={imageFile ? URL.createObjectURL(imageFile) : ""} className="w-32 h-32" />
                    <input accept="image/*" ref={fileInputRef} onChange={(e) => setImageFile(e.target.files![0])} type="file" />
                    <button type="submit" onClick={handleSubmit} className="w-32">Submit</button>
                </div>
            </div>
        )
    } else {

        let displayFields = {
            username: "",
            email: ""
        }

        return (
            <div className={`flex gap-y-3 text-white flex-col bg-slate-900 border p-8 border-slate-500 rounded-md w-full h-1/2`} >
                <div className="flex flex-col gap-y-3">
                    <h1 className="text-white text-2xl font-bold">Your profile:</h1>
                    <div className="animate-pulse bg-slate-700 rounded-full w-3/12 h-8" />
                    <div className="animate-pulse bg-slate-700 rounded-full w-3/12 h-8" />
                    <div className="animate-pulse bg-slate-700 rounded-full w-3/12 h-8" />
                </div>
            </div>
        )
    }



}