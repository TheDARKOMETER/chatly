import Link from "next/link";
import { useAuth } from "@/app/authcontext";
export default function Header() {
    const {user} = useAuth()
    return (
        <div className="flex text-white items-center justify-between flex-row py-2">
            <Link href="/"><h1 className="text-2xl font-extrabold">Chatly</h1></Link>
            <nav className="">
                <ul className="">
                    <li className="gap-x-3 flex flex-row">
                        <Link href="/signup">Sign Up</Link>
                        <Link href="/login">Login</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
