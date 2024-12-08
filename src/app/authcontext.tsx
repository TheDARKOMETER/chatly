'use client'
import React, { createContext, SetStateAction, useEffect, useState } from 'react'
import { AuthResponse, ValidationErrors } from './types.tsx'
import PocketBase, { AuthModel, BaseAuthStore } from "pocketbase"
const AuthContext = createContext({  
    pb: new PocketBase("http://127.0.0.1:8090"),
    login: async (user: FormData): Promise<AuthResponse> => {return {success: false, message: ""}},
    signup: async (user: FormData): Promise<AuthResponse> => {return {success: false, message: ""}},
    user: BaseAuthStore
})

export function useAuth() {
    return React.useContext(AuthContext)
}

export default function authcontext(props: { children: React.ReactNode }) {


    const pb = new PocketBase("http://127.0.0.1:8090")
    const [user, setUser]: [ AuthModel | null, React.Dispatch<SetStateAction<AuthModel | null>>] = useState(pb.authStore.model)

    useEffect(() => {
        console.log(pb.authStore)
        console.log(pb.authStore.isValid);
        console.log(pb.authStore.token);
    }, [pb.authStore])


    async function login(user: FormData): Promise<AuthResponse> {
        try {
            const authData = await pb.collection('users').authWithPassword(user.get("email") as string, user.get("password") as string)
            console.log(authData)
            setUser(pb.authStore.model)
            return { success: true, message: "You have successfully logged in" }
        } catch(error: unknown) {
            const validationError = error as ValidationErrors
            let errorMessage = 'Error signing up'
            console.error("Error!")
            if (Object.values(validationError.response.data)[0].message) {
                errorMessage = Object.values(validationError.response.data)[0].message
            }
            return { success: false, message: `${errorMessage}` }
        }
    }

    async function signup(user: FormData): Promise<AuthResponse> {
        try {
            const userObj = {
                "username": user.get("username") as string,
                "email": user.get("email") as string,
                "password": user.get("password") as string,
                "passwordConfirm": user.get("confirm_password") as string
            }
            const record = await pb.collection('users').create(userObj)
            return { success: true, message: "You have successfully signed up, please login" }
        }
        catch (error: unknown) {
            const validationError = error as ValidationErrors
            let errorMessage = 'Error signing up'
            if (Object.values(validationError.response.data)[0].message) {
                errorMessage = Object.values(validationError.response.data)[0].message
            }
            return { success: false, message: `${errorMessage}` }
        }
    }


    const values = {
        pb,
        login,
        signup,
        user
    }


    return (
        <AuthContext.Provider value={values}>
            {props.children}
        </AuthContext.Provider>
    )


}
