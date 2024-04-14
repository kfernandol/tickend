export interface ProjectForm {
    name: string,
    description: string,
    photo: File,
    ticketStatus: number[],
    ticketPriorities: number[],
    ticketTypes: number[],
    clients: number[],
    developers: number[]
}
