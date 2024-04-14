export interface ProjectResponse {
    id: number,
    name: string,
    photo: string,
    description: string,
    ticketStatus: number[],
    ticketPriorities: number[],
    ticketTypes: number[],
    clients: number[],
    developers: number[]
}