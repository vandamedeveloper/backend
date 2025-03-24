import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { ValidationError, UnauthorizedError } from '../types/errors';

const userRepository = AppDataSource.getRepository(User);

interface JwtPayload {
    userId: number;
    email: string;
}

export class AuthService {
    static async register(name: string, email: string, password: string) {
        // Validación de campos requeridos
        if (!name || name.trim() === '') {
            throw new ValidationError('El nombre es requerido');
        }
        if (!email || email.trim() === '') {
            throw new ValidationError('El email es requerido');
        }
        if (!password || password.trim() === '') {
            throw new ValidationError('La contraseña es requerida');
        }

        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ValidationError('El email ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword
        });

        await userRepository.save(user);
        return this.generateToken(user);
    }

    static async login(email: string, password: string) {
        if (!email || email.trim() === '') {
            throw new ValidationError('El email es requerido');
        }
        if (!password || password.trim() === '') {
            throw new ValidationError('La contraseña es requerida');
        }

        const user = await userRepository.findOne({ where: { email: email.trim().toLowerCase() } });
        if (!user) {
            throw new UnauthorizedError('Credenciales inválidas');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new UnauthorizedError('Credenciales inválidas');
        }

        return this.generateToken(user);
    }

    private static generateToken(user: User): string {
        const payload: JwtPayload = {
            userId: user.id,
            email: user.email
        };

        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

        // @ts-ignore - Ignoramos el error de tipado de JWT ya que sabemos que los tipos son correctos
        return jwt.sign(payload, secret, { expiresIn });
    }
} 