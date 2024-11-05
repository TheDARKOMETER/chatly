'use server'
import PocketBase from 'pocketbase';
import { User } from './page';

const pb: PocketBase = new PocketBase('http://127.0.0.1:8090');

export const AddReaction = (): void => {

}

export const Flag = (): void => {
}

export const SignUp = async (user: FormData): Promise<{ success: boolean; message: string }> => {
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
        return { success: true, message: "You have successfully signed up, please login" }
    }
    catch (error) {
        return { success: false, message: `Failed to login ${error}` }
    }
}


