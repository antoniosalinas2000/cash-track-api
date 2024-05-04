export interface CustomError {
    status: number;
    message: string;
}

export function isCustomError(error: any): error is CustomError {
    return error && typeof error.status === 'number' && typeof error.message === 'string';
}
