import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Todo } from "../entity/Todo";
import { User } from "../entity/User";
import { auth } from "../middleware/auth";
import { ApiResponseBuilder } from "../types/response";
import { NotFoundError, ForbiddenError, ValidationError } from "../types/errors";

const router = Router();
const todoRepository = AppDataSource.getRepository(Todo);
const userRepository = AppDataSource.getRepository(User);

// Crear todo
router.post("/", auth, async (req, res, next) => {
    try {
        const { title, description, completed = false } = req.body;

        if (!title || title.trim() === '') {
            throw new ValidationError('El título es requerido');
        }
        if (!description || description.trim() === '') {
            throw new ValidationError('La descripción es requerida');
        }

        const user = await userRepository.findOneBy({ id: req.user?.userId });

        if (!user) {
            throw new NotFoundError("Usuario no encontrado");
        }

        const todo = todoRepository.create({
            title: title.trim(),
            description: description.trim(),
            completed,
            user
        });

        await todoRepository.save(todo);
        
        const todoResponse = {
            id: todo.id,
            title: todo.title,
            description: todo.description,
            completed: todo.completed,
            createdAt: todo.createdAt,
            updatedAt: todo.updatedAt
        };

        res.status(201).json(ApiResponseBuilder.success(todoResponse));
    } catch (error) {
        next(error);
    }
});

// Obtener todos los todos del usuario autenticado
router.get("/", auth, async (req, res, next) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 2;
        const order = ((req.query.order as string)?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC') as 'ASC' | 'DESC';
        const skip = (page - 1) * limit;

        const [todos, total] = await todoRepository.findAndCount({
            where: { user: { id: req.user?.userId } },
            skip,
            take: limit,
            order: {
                updatedAt: order
            }
        });

        const totalPages = Math.ceil(total / limit);

        const todosResponse = todos.map(todo => ({
            id: todo.id,
            title: todo.title,
            description: todo.description,
            completed: todo.completed,
            createdAt: todo.createdAt,
            updatedAt: todo.updatedAt
        }));

        const meta = {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            order
        };

        res.json(ApiResponseBuilder.success(todosResponse, meta));
    } catch (error) {
        next(error);
    }
});

// Obtener un todo por ID
router.get("/:id", auth, async (req, res, next) => {
    try {
        const todo = await todoRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["user"]
        });
        
        if (!todo) {
            throw new NotFoundError("Todo no encontrado");
        }

        if (todo.user.id !== req.user?.userId) {
            throw new ForbiddenError("No tienes permiso para ver este todo");
        }

        const todoResponse = {
            id: todo.id,
            title: todo.title,
            description: todo.description,
            completed: todo.completed,
            createdAt: todo.createdAt,
            updatedAt: todo.updatedAt
        };

        res.json(ApiResponseBuilder.success(todoResponse));
    } catch (error) {
        next(error);
    }
});

// Actualizar todo
router.put("/:id", auth, async (req, res, next) => {
    try {
        const { title, description, completed } = req.body;
        const todo = await todoRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["user"]
        });
        
        if (!todo) {
            throw new NotFoundError("Todo no encontrado");
        }

        if (todo.user.id !== req.user?.userId) {
            throw new ForbiddenError("No tienes permiso para modificar este todo");
        }

        if (title) todo.title = title.trim();
        if (description) todo.description = description.trim();
        if (typeof completed === 'boolean') todo.completed = completed;
        
        await todoRepository.save(todo);

        const todoResponse = {
            id: todo.id,
            title: todo.title,
            description: todo.description,
            completed: todo.completed,
            createdAt: todo.createdAt,
            updatedAt: todo.updatedAt
        };

        res.json(ApiResponseBuilder.success(todoResponse));
    } catch (error) {
        next(error);
    }
});

// Eliminar todo
router.delete("/:id", auth, async (req, res, next) => {
    try {
        const todo = await todoRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["user"]
        });
        
        if (!todo) {
            throw new NotFoundError("Todo no encontrado");
        }

        if (todo.user.id !== req.user?.userId) {
            throw new ForbiddenError("No tienes permiso para eliminar este todo");
        }

        await todoRepository.remove(todo);
        res.json(ApiResponseBuilder.success({ message: "Todo eliminado exitosamente" }));
    } catch (error) {
        next(error);
    }
});

export default router; 