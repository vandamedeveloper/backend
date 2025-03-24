import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ValidationError('El email ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({
            name,
            email,
            password: hashedPassword
        });

        await userRepository.save(user);
        return this.generateToken(user);
    }

    static async login(email: string, password: string) {
        const user = await userRepository.findOne({ where: { email } });
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

        return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
    }
} 