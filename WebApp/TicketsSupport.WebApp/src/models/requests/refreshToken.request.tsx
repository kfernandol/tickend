export interface RefreshTokenRequest {
    refreshToken: string,
    username: string
    organizationId?: number
}