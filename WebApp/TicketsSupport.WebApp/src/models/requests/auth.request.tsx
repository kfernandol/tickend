export interface AuthRequest {
    username: string;
    password: string;
}

export interface AuthRegisterRequest {
    username: string,
    firstName: string,
    lastName: string,
    password: string,
    email: string
}