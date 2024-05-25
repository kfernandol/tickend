export interface BasicResponse {
    success: boolean,
    message: string
}

export interface ErrorResponse {
    code: number,
    message: string,
    details: string
}

export interface ErrorsResponse {
    code: number,
    message: string,
    details: ErrorsDetail
}

export interface ErrorsDetail {
    [key: string]: string[];
}