import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/errors';
import { ApiResponseBuilder } from '../types/response';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json(
            ApiResponseBuilder.error(err.message)
        );
    }

    console.error('Error:', err);

    return res.status(500).json(
        ApiResponseBuilder.error('Error interno del servidor')
    );
}; 