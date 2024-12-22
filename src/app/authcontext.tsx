'use client'
import React, { createContext, SetStateAction, useEffect, useState } from 'react'
import { AuthResponse, ValidationErrors, AuthContextType } from './types.tsx'
import PocketBase, { AuthModel, RecordModel } from "pocketbase"
import Client from 'pocketbase'
const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
    return React.useContext(AuthContext)
}

export default function authcontext(props: { children: React.ReactNode }) {


    const pb: Client = new PocketBase("http://127.0.0.1:8090")
    const [user, setUser]: [ AuthModel | null, React.Dispatch<SetStateAction<AuthModel | null>>] = useState(pb.authStore.model)

    useEffect(() => {
        console.log(pb.authStore)
        console.log(pb.authStore.isValid);
        console.log(pb.authStore.token);
        console.log(pb.authStore)
    }, [pb.authStore])

    useEffect(() => {
        if (user){
            console.log(user)
        }

    }, [user])


    async function login(input: FormData): Promise<AuthResponse> {
        try {
            const authData = await pb.collection('users').authWithPassword(input.get("username") as string, input.get("password") as string)
            console.log(authData)
            setUser(pb.authStore.model)
            return { success: true, message: "You have successfully logged in" }
        } catch(error: unknown) {
            let errorMessage = 'Error signing up'
            return { success: false, message: `${errorMessage}` }
        }
    }

    async function signup(input: FormData): Promise<AuthResponse> {
        try {
            const userObj = {
                "username": input.get("username") as string,
                "email": input.get("email") as string,
                "password": input.get("password") as string,
                "passwordConfirm": input.get("confirm_password") as string
            }
            const record = await pb.collection('users').create(userObj)
            return { success: true, message: "You have successfully signed up, please login" }
        }
        catch (error: unknown) {
            const validationError = error as ValidationErrors
            let errorMessage = 'Failed to authenticate'
            return { success: false, message: `${errorMessage}` }
        }
    }

    async function logout(): Promise<AuthResponse> {
        try {
            await pb.authStore.clear()
            setUser(null)
            return { success: true, message: "You have successfully logged out" }
        }
        catch (error: unknown) {
            const validationError = error as ValidationErrors
            let errorMessage = 'Error logging out'
            if (Object.values(validationError.response.data)[0].message) {
                errorMessage = Object.values(validationError.response.data)[0].message
            }
            return { success: false, message: `${errorMessage}` }
        }
    }

    async function getAvatarUrl(record: RecordModel, avatar: string): Promise<string> {
        return await pb.files.getUrl(record, avatar, {'thumb': '100x100'})
    }

    const values = {
        pb,
        login,
        signup,
        user,
        logout,
        getAvatarUrl
    }


    return (
        <AuthContext.Provider value={values}>
            {props.children}
        </AuthContext.Provider>
    )


}
