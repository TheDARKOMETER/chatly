'use client'

import Link from "next/link";
import { useAuth } from "@/app/authcontext";
import { ReactElement, useEffect, useState } from "react";
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
                <div className="flex flex-row justify-end gap-x-3 w-3/12">
                    <div className="animate-pulse rounded-full bg-slate-700 h-8 w-2/12"></div>
                    <div className="animate-pulse rounded-full bg-slate-700 h-8 w-3/12"></div>
                </div>
            </div>
        )
    }

    if (authContext) {

        const { user, logout } = authContext

        const handleLogout = async () => {
            await logout()
        }

        return (
            <div className="flex text-white items-center justify-between flex-row py-2">
                <Link href="/"><h1 className="text-2xl font-extrabold">Chatly</h1></Link>
                <nav className="">
                    <ul className="">
                        <li className="gap-x-3 flex flex-row">
                            {user && user.username ? <Link href={`/user/profile`}>{user.username}</Link> : <Link href="/signup">Sign Up</Link>}
                            {!user ? <Link href="/login">Login</Link> : <Link href="/logout" onClick={handleLogout}>Logout</Link>}
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }


}

function HeaderModal(props: { message: string; isSuccess: boolean; toggleModal: React.Dispatch<React.SetStateAction<boolean>> }): ReactElement {
    return (
        <div id="modal-blur-background" className='fixed top-0 left-0 z-10 h-screen w-screen bg-gray/50 backdrop-blur-sm flex justify-center items-center'>
            <div className='bg-slate-900 justify-between p-4 flex flex-col text-white border border-slate-500 rounded-md w-1/3 h-32'>
                <p>{props.message}</p>
                <div className='justify-end self-end  flex flex-row w-full gap-x-3'>
                    {(
                            <button onClick={() => props.toggleModal(false)} className='text-center border border-slate-500 w-2/12 rounded'>Ok</button>   
                    )}
                </div>
            </div>
        </div>
    )
}