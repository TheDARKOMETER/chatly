'use client'

import React, { ReactElement, useActionState, useEffect, useState } from 'react'
import styles from './signup.module.css'
import { SignUp } from '../actions'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link'

export default function page() {
    const [showModal, setShowModal] = useState(false)
    //const {loading, error, data} = useActionState(SignUp)

    return (
        <>
            {showModal && <SignUpModal />}
            <div className={`${styles['signup-container']} relative py-12 text-white my-12 mx-auto border border-slate-500 rounded-md shadow-lg p-2`}>
                <Link className='absolute top-0 left-0 m-4 flex text-sm items-center' href={"/"}><ArrowBackIcon fontSize='small' /><span className=''>Back</span></Link>
                <h1 className='text-2xl font-bold'>Sign Up</h1>
                <form action={SignUp} className='flex flex-col gap-y-4 w-full px-12'>
                    <input className={`border border-slate-500 bg-slate-800 p-1 rounded`} name="username" placeholder='Username'></input>
                    <input className={`border border-slate-500 bg-slate-800 p-1 rounded`} name="email" type='email' placeholder='Email'></input>
                    <input className={`border border-slate-500 bg-slate-800 p-1 rounded`} name="password" type='password' placeholder='Password'></input>
                    <input className={`border border-slate-500 bg-slate-800 p-1 rounded`} name="confirm_password" type='password' placeholder='Confirm Password'></input>
                    <button type='submit' className={`border border-slate-500 w-1/4 mt-4 self-center rounded hover:bg-slate-200 transition-colors hover:text-black`}>Sign Up</button>
                </form>
            </div >
        </>

    )
}

function SignUpModal(): ReactElement {
    return (
        <div id="modal-blur-background" className='fixed top-0 left-0 z-10 h-screen w-screen bg-gray/50 backdrop-blur-sm flex justify-center items-center'>
            <div className='bg-slate-900 justify-between p-4 flex flex-col text-white border border-slate-500 rounded-md w-1/3 h-32'>
                <p>You have successfully signed up, please login.</p>
                <div className='justify-end self-end  flex flex-row w-full gap-x-3'>
                    <Link href={"/login"} className='text-center border border-slate-500 w-2/12 rounded bg-slate-200 text-black'>Login</Link>
                    <Link href={"/"} className='text-center border border-slate-500 w-2/12 rounded'>Go back</Link>
                </div>
            </div>
        </div>
    )
}