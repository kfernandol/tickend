export interface UserResponse {
    id: number,
    photo: string,
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    phone?: string,
    direction?: string,
    rolId: number,
    levelPermission: string
}