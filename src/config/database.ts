import { DataSourceOptions } from 'typeorm';
import path from 'path';
import { User } from '../entities/User';
import { Todo } from '../entities/Todo';

const isProduction = process.env.NODE_ENV === 'production';

export const databaseConfig: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'todo_db',
    entities: [User, Todo],
    migrations: [
        path.join(__dirname, '..', 'migrations', '*.{ts,js}')
    ],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development'
}; 