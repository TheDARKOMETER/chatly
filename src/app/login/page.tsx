
'use client'
import Link from 'next/link'
import styles from './login.module.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Login } from '@mui/icons-material';
export default function page() {
    return (
        <div className={`${styles['login-container']} relative border border-slate-500 rounded-md p-12 text-white`}>
            <Link className='absolute top-0 left-0 m-4 flex text-sm items-center' href={"/"}><ArrowBackIcon fontSize='small' /><span className=''>Back</span></Link>
            <h1 className='text-2xl font-bold text-center'>Login</h1>
            <form action={Login} className='flex flex-col gap-y-3'>
                <input className={`border border-slate-500 bg-slate-800 p-1 rounded`} name="username" placeholder='Username'></input>
                <input className={`border border-slate-500 bg-slate-800 p-1 rounded`} name="password" type='password' placeholder='Password'></input>
                <button className={`border border-slate-500 px-4 mt-4 self-center rounded hover:bg-slate-200 transition-colors hover:text-black`}>Log In</button>
            </form>
        </div>
    )
}
