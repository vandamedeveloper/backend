import { Router } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { AuthService } from "../services/authService";
import { auth } from "../middleware/auth";
import { ApiResponseBuilder } from "../types/response";
import { NotFoundError } from "../types/errors";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

// Registro de usuario
router.post("/register", async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const token = await AuthService.register(name, email, password);
        res.status(201).json(ApiResponseBuilder.success({ token }));
    } catch (error) {
        next(error);
    }
});

// Login de usuario
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const token = await AuthService.login(email, password);
        res.json(ApiResponseBuilder.success({ token }));
    } catch (error) {
        next(error);
    }
});

// Obtener información del usuario autenticado
router.get("/me", auth, async (req, res, next) => {
    try {
        const user = await userRepository.findOne({
            where: { id: req.user?.userId },
            select: ["id", "name", "email", "createdAt", "updatedAt"] // Incluimos los timestamps
        });

        if (!user) {
            throw new NotFoundError("Usuario no encontrado");
        }

        res.json(ApiResponseBuilder.success(user));
    } catch (error) {
        next(error);
    }
});

export default router; 