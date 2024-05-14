export interface AuditLogsResponse {
    id: number,
    userId: number,
    action: number,
    date: Date,
    table: string,
    primaryId: string,
    auditLogDetailResponses: AuditLogDetailResponse[]
}

export interface AuditLogDetailResponse {
    id: number,
    columnName: string,
    oldValue: string,
    newValue: string,
    typeValue: number
}

export interface AuditLogActionsResponse {
    id: number,
    name: string
}