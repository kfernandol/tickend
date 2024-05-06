export interface AuthToken {
    id: string,
    name: string,
    sub: string,
    email: string,
    PermissionLevel: string,
    nbf: number,
    exp: number,
    iat: number,
    iss: string,
    aud: string
}