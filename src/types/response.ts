export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    order?: 'ASC' | 'DESC';
}

export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    error: string | null;
    meta?: PaginationMeta;
}

export class ApiResponseBuilder {
    static success<T>(data: T, meta?: PaginationMeta): ApiResponse<T> {
        return {
            success: true,
            data,
            error: null,
            meta
        };
    }

    static error(message: string): ApiResponse<null> {
        return {
            success: false,
            data: null,
            error: message
        };
    }
} 