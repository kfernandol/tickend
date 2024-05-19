export interface UserFormModel {
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string
    phone?: string,
    direction?: string,
    rolId: number,
}