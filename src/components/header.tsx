'use client'

import Link from "next/link";
import { useAuth } from "@/app/authcontext";
import { useEffect, useState } from "react";
export default function Header() {

    const authContext = useAuth()
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
        console.log(authContext)
        if (authContext) {
            setIsHydrated(true)
        }
    }, [authContext])

    if (!isHydrated) {
        return (
            <div className="flex text-white items-center justify-between flex-row py-2">
               <div className="animate-pulse rounded-full bg-slate-700 h-8 w-1/12"></div>
               <div className="animate-pulse rounded-full bg-slate-700 h-8 w-2/12"></div>
            </div>
        )
    }

    if (authContext) {

        const { user } = authContext

        return (
            <div className="flex text-white items-center justify-between flex-row py-2">
                <Link href="/"><h1 className="text-2xl font-extrabold">Chatly</h1></Link>
                <nav className="">
                    <ul className="">
                        <li className="gap-x-3 flex flex-row">
                            {user && user.username ? <Link href="/profile">{user.username}</Link> : <Link href="/signup">Sign Up</Link>}
                            {!user ? <Link href="/login">Login</Link> : <Link href="/logout">Logout</Link>}
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }


}
