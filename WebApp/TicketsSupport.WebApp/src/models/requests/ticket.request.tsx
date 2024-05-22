export interface TicketRequest {
    id?: number,
    title: string,
    description: string,
    projectId: number,
    ticketTypeId: number,
    ticketPriorityId?: number,
    ticketStatusId?: number,
    reply?: number,
    isClosed?: boolean
}