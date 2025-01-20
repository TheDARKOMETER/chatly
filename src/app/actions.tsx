'use server'
import PocketBase from 'pocketbase';
import { ChatMessage } from "@/app/types";

const pb: PocketBase = new PocketBase('http://127.0.0.1:8090');

export const AddReaction = (): void => {

}

export const Flag = (): void => {
}

export const getMessages = (): ChatMessage[] => {

    return []
}

export const SignUp = async (user: FormData): Promise<AuthResponse> => {
    //pb.collections.
    "use server"
    console.log(user)
    try {
        const userObj = {
            "username": user.get("username") as string,
            "email": user.get("email") as string,
            "password": user.get("password") as string,
            "passwordConfirm": user.get("confirm_password") as string
        }
        const record = await pb.collection('users').create(userObj)
        console.log("Success")
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


export const Login = async (user: FormData): Promise<AuthResponse>  => {
    try {
        const authData = await pb.collection('users').authWithPassword(user.get("email") as string, user.get("password") as string)
        console.log(authData, "nice ")
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


interface ValidationError {
    data(data: any): unknown;
    code: string;
    message: string
}

interface ValidationErrors {
    [key: string]: ValidationError
}

interface AuthResponse { success: boolean; message: string }