import express from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/userRoutes";
import todoRoutes from "./routes/todoRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

// Middleware para rutas no encontradas (404)
app.use(notFoundHandler);

// Middleware de manejo de errores
app.use(errorHandler);

// Inicializar la conexión a la base de datos
AppDataSource.initialize()
    .then(() => {
        console.log("Conexión a la base de datos establecida");
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((error) => console.log("Error al conectar con la base de datos:", error)); 