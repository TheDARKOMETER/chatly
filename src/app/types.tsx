import Client, { AuthModel, RecordService } from "pocketbase";
export interface ValidationError {
    data(data: any): unknown;
    code: string;
    message: string
}

export interface AuthContextType {
    pb: Client;
    login: (user: FormData) => Promise<AuthResponse>;
    signup: (user: FormData) => Promise<AuthResponse>;
    user: AuthModel | null;
    logout: () => Promise<AuthResponse>;
}

export interface ValidationErrors {
    [key: string]: ValidationError
}

export interface AuthResponse { success: boolean; message: string }
