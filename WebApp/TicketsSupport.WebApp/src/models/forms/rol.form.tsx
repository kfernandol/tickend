export interface RolFormModel {
    name: string;
    permissionLevel: number;
    menus: menus[];
}

interface menus {
    id: number,
    name: string
}