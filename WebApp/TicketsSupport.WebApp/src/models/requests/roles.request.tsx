export interface RolesRequestPost {
    name: string,
    permissionLevel: number
}

export interface RolesRequestPut {
    id: number,
    name: string,
    permissionLevel: number,
}