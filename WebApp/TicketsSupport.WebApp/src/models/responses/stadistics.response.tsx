import { ProjectResponse } from "./project.response"

export interface ChartData {
    name?: string,
    labels: string[],
    data: number[]
}

export interface TicketsByProjectResponse {
    project: ProjectResponse,
    total: number,
    open: number,
    closed: number,
    pending: number
}