
'use client'
import Link from 'next/link'
import styles from './login.module.css'
import { useState, ReactElement, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AuthResponse } from '../types';
import authcontext, { useAuth } from '../authcontext';
import { redirect } from 'next/navigation';
export default function page() {
    const [showModal, setShowModal] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [isHydrated, setIsHydrated] = useState(false)
    const authContext = useAuth()



    useEffect(() => {
        if (authContext) {
            setIsHydrated(true)
        }

    }, [authContext])

    if(!isHydrated) {
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
        const { login, user } = authContext;

        const handleLogin = async (formData: FormData) => {
            const loginAttempt: AuthResponse = await login(formData)
    
            const configureModal = (): void => {
                setIsSuccess(loginAttempt.success)
                setModalMessage(loginAttempt.message)
            }
            configureModal()
            setShowModal(true)
        }

        if (!user) {
            return (
                <>
                    {showModal && <LoginModal message={modalMessage} isSuccess={isSuccess} toggleModal={setShowModal} />}
                    <div className={`${styles['login-container']} relative border border-slate-500 rounded-md p-12 text-white`}>
                        <Link className='absolute top-0 left-0 m-4 flex text-sm items-center' href={"/"}><ArrowBackIcon fontSize='small' /><span className=''>Back</span></Link>
                        <h1 className='text-2xl font-bold text-center'>Login</h1>
                        <form action={handleLogin} className='flex flex-col gap-y-3'>
                            <input className={`border border-slate-500 bg-slate-800 p-1 rounded`} name="username" placeholder='Username'></input>
                            <input className={`border border-slate-500 bg-slate-800 p-1 rounded`} name="password" type='password' placeholder='Password'></input>
                            <button className={`border border-slate-500 px-4 mt-4 self-center rounded hover:bg-slate-200 transition-colors hover:text-black`}>Log In</button>
                        </form>
                    </div>
                </>
            )
        }
        else {
            return redirect('/')
        }
    }

}

function LoginModal(props: { message: string; isSuccess: boolean; toggleModal: React.Dispatch<React.SetStateAction<boolean>> }): ReactElement {
    return (
        <div id="modal-blur-background" className='fixed top-0 left-0 z-10 h-screen w-screen bg-gray/50 backdrop-blur-sm flex justify-center items-center'>
            <div className='bg-slate-900 justify-between p-4 flex flex-col text-white border border-slate-500 rounded-md w-1/3 h-32'>
                <p>{props.message}</p>
                <div className='justify-end self-end  flex flex-row w-full gap-x-3'>
                    {props.isSuccess && (
                        <>
                            <Link href={"/"} className='text-center border border-slate-500 w-20 rounded'>Home</Link>
                        </>
                    )}
                    {
                        !props.isSuccess && (
                            <button onClick={() => props.toggleModal(false)} className='text-center border border-slate-500 w-20 rounded'>Try again</button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}