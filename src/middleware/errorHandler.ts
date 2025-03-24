import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/errors';
import { ApiResponseBuilder } from '../types/response';

// Middleware para rutas no encontradas
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json(
        ApiResponseBuilder.error(`El endpoint ${req.method} ${req.path} no existe`)
    );
};

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