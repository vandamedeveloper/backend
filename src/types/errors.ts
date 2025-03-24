export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(400, message);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(404, message);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = "No autorizado") {
        super(401, message);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = "Acceso denegado") {
        super(403, message);
    }
} 