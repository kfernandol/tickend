import { MenusResponse } from "./menus.response";

export interface RolesResponse {
    id: number,
    name: string,
    description?: string,
    permissionLevelId: number,
    menus: MenusResponse[]
}
