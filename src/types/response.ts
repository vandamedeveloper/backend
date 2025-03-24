export interface ApiResponse<T = any> {
    success: boolean;
    data: T | null;
    error: string | null;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

export class ApiResponseBuilder {
    static success<T>(data: T, meta?: ApiResponse['meta']): ApiResponse<T> {
        return {
            success: true,
            data,
            error: null,
            meta
        };
    }

    static error(message: string): ApiResponse {
        return {
            success: false,
            data: null,
            error: message
        };
    }
} 