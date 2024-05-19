export interface RolFormModel {
    name: string,
    description: string,
    permissionLevel: number,
    menus: menus[],
}

interface menus {
    id: number,
    name: string
}