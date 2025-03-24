import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Todo } from "./entity/Todo";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "todo_db",
    synchronize: true,
    logging: false,
    entities: [User, Todo],
    subscribers: [],
    migrations: []
}); 