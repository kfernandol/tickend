export interface ProjectRequest {
    photo: string,
    name: string,
    description: string,
    ticketStatus: number[],
    ticketPriorities: number[],
    ticketTypes: number[],
    clients: number[],
    developers: number[]
}