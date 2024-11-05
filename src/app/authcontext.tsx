'use client'
import React, { useEffect, useState } from 'react'
import PocketBase from "pocketbase"
const AuthContext = React.createContext({})

export function useAuthA() {
    return React.useContext(AuthContext)
}

export default function authcontext(props: { children: React.ReactNode }) {
    const pb = new PocketBase("http://127.0.0.1:8090")
    useEffect(() => {
        console.log(pb.authStore)
        console.log(pb.authStore.isValid);
        console.log(pb.authStore.token);
    }, [])

    const values = {
        pb
    }

    return (
        <AuthContext.Provider value={values}>
            {props.children}
        </AuthContext.Provider>
    )
}
