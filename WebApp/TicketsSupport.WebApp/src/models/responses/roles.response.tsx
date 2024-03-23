import { MenusResponse } from "./menus.response";

export interface RolesResponse {
    id: number,
    name: string,
    permissionLevel: string,
    menus: MenusResponse[]
}
