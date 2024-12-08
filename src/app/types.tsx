
export interface ValidationError {
    data(data: any): unknown;
    code: string;
    message: string
}

export interface ValidationErrors {
    [key: string]: ValidationError
}

export interface AuthResponse { success: boolean; message: string }
