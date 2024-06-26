export interface ProjectForm {
    name: string,
    description: string,
    photo: string,
    ticketStatus: number[],
    ticketPriorities: number[],
    ticketTypes: number[],
    clients: number[],
    developers: number[]
}
