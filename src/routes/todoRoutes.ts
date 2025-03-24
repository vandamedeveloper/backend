import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Todo } from "../entity/Todo";
import { User } from "../entity/User";

const router = Router();
const todoRepository = AppDataSource.getRepository(Todo);
const userRepository = AppDataSource.getRepository(User);

// Crear todo
router.post("/", async (req, res) => {
    try {
        const { title, description, userId } = req.body;
        const user = await userRepository.findOneBy({ id: userId });

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const todo = todoRepository.create({
            title,
            description,
            user
        });

        await todoRepository.save(todo);
        res.status(201).json({ message: "Todo creado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el todo" });
    }
});

// Obtener todos los todos de un usuario
router.get("/user/:userId", async (req, res) => {
    try {
        const todos = await todoRepository.find({
            where: { user: { id: parseInt(req.params.userId) } },
            relations: ["user"]
        });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los todos" });
    }
});

// Obtener un todo por ID
router.get("/:id", async (req, res) => {
    try {
        const todo = await todoRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["user"]
        });
        
        if (!todo) {
            return res.status(404).json({ error: "Todo no encontrado" });
        }
        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el todo" });
    }
});

// Actualizar todo
router.put("/:id", async (req, res) => {
    try {
        const { title, description, completed } = req.body;
        const todo = await todoRepository.findOneBy({ id: parseInt(req.params.id) });
        
        if (!todo) {
            return res.status(404).json({ error: "Todo no encontrado" });
        }

        todo.title = title;
        todo.description = description;
        todo.completed = completed;
        
        await todoRepository.save(todo);
        res.json({ message: "Todo actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el todo" });
    }
});

// Eliminar todo
router.delete("/:id", async (req, res) => {
    try {
        const todo = await todoRepository.findOneBy({ id: parseInt(req.params.id) });
        
        if (!todo) {
            return res.status(404).json({ error: "Todo no encontrado" });
        }

        await todoRepository.remove(todo);
        res.json({ message: "Todo eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el todo" });
    }
});

export default router; 