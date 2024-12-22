"use client"
import { useAuth } from "@/app/authcontext"
import { useEffect, useState } from "react"

export default function page() {
    
    const authContext = useAuth()
    const [hydrated, setIsHydrated] = useState(false)

    let user, avatarUrl, username, email, created = null

    useEffect(() => {
        if (authContext) {
            setIsHydrated(true)
        }
    }, [authContext])
    
    if (hydrated) {
        user = authContext?.user
        avatarUrl = user?.avatar
        username = user?.username
        email = user?.email
        created = user?.created

        return (
            <div className={`flex gap-y-3 text-white flex-col bg-slate-900 border p-8 border-slate-500 rounded-md w-full h-1/2`} >
                    <h1 className="text-white text-2xl font-bold">Your profile:</h1>
                    <p>Username: {username}</p>
                    <p>Email: {email}</p>
                    <p>Joined: {new Date(created).toLocaleDateString()}</p>
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