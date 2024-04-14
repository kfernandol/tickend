export interface ProfileForm {
    userId: string,
    photo: File,
    firstName: string,
    lastName: string,
    password: string,
    confirmPassword: string,
    email: string
}