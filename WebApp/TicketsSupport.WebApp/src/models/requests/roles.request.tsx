export interface RolesRequest {
    id?: number,
    name: string,
    description?: string,
    permissionLevel: number,
    menus: number[]
}