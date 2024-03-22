export interface MenusRequestPost {
    name: string,
    url: string,
    icon: string,
    position: number,
    parentId: number,
    show: boolean
}

export interface MenusRequestPut {
    id: number,
    name: string,
    url: string,
    icon: string,
    position: number,
    parentId: number,
    show: boolean
}