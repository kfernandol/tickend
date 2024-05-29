export interface AuthRequest {
    username: string,
    password: string,
    organization?: number
}

export interface AuthRegisterRequest {
    username: string,
    firstName: string,
    lastName: string,
    password: string,
    email: string
}