export interface TicketForm {
    Id: number,
    Title: string,
    Description: string,
    Project: number | null,
    Type: number | null,
    Priority: number | null,
    Status: number | null,
    Closed: boolean,
}