export default function Header() {
    return (
        <div className="flex text-white items-center justify-between flex-row mx-36 py-2">
            <h1 className="text-2xl font-extrabold">Chatly</h1>
            <nav className="">
                <ul className="">
                    <li className="gap-x-3 flex flex-row">
                        <a href="#">Sign Up</a>
                        <a href="#">Login</a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
