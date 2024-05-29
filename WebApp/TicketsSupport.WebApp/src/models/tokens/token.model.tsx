export interface AuthToken {
    id: string,
    name: string,
    sub: string,
    email: string,
    organization: string,
    permissionLevel: string,
    nbf: number,
    exp: number,
    iat: number,
    iss: string,
    aud: string
}