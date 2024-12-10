"use client"
import { useAuth } from "@/app/authcontext"

export default function page() {
    
    const authContext = useAuth()

    let user, avatarUrl, username, email = null
    
    if (authContext) {
        user = authContext.user
        avatarUrl = user?.avatar
        username = user?.username
        email = user?.email
    }
    

    return (
        <div className={`flex flex-col bg-slate-900 border p-8 border-slate-500 rounded-md w-full h-1/2`} >
            <div>
                <h1 className="text-white text-2xl font-bold">Your profile:</h1>
                <p>{username}</p>
            </div>
        </div>
    )
}