export interface TicketResponse {
    id: number,
    title: string,
    description: string,
    projectId: number,
    ticketTypeId: number,
    ticketPriorityId: number,
    ticketStatusId: number,
    dateCreated: string,
    dateUpdated: string,
    isClosed: boolean
}