export interface ProfileForm {
    userId: string,
    photo: string,
    firstName: string,
    lastName: string,
    password: string,
    confirmPassword: string,
    email: string,
    direction?: string,
    phone?: string
}