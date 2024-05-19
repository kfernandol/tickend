export interface UserRequest{
    id?: number,
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    direction?: string,
    phone?: string,
    rolId: number
}