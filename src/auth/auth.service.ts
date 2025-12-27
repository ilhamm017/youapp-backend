import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    /**
     * Register a new user
     */
    async register(registerDto: RegisterDto): Promise<{ access_token: string; user: any }> {
        const { email, username, password } = registerDto;

        // Check if user already exists
        const existingUser = await this.userModel.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            if (existingUser.email === email) {
                throw new ConflictException('Email already exists');
            }
            if (existingUser.username === username) {
                throw new ConflictException('Username already exists');
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new this.userModel({
            email,
            username,
            password: hashedPassword,
            profile: {},
        });

        await newUser.save();

        // Generate JWT token
        const payload = { sub: newUser._id, username: newUser.username };
        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
        };
    }

    /**
     * Login user
     */
    async login(loginDto: LoginDto): Promise<{ access_token: string; user: any }> {
        const { usernameOrEmail, password } = loginDto;

        // Find user by username or email
        const user = await this.userModel
            .findOne({
                $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
            })
            .select('+password');

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate JWT token
        const payload = { sub: user._id, username: user.username };
        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        };
    }

    /**
     * Validate user for JWT strategy
     */
    async validateUser(userId: string): Promise<UserDocument | null> {
        return this.userModel.findById(userId);
    }
}
