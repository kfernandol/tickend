export interface UserRequestPost {
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    rolId: number
}

export interface UserRequestPut {
    id: number,
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    rolId: number
}