import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
export declare class AuthService {
    private prisma;
    private jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateGoogleUser(profile: any): Promise<{
        id: string;
        email: string;
        name: string;
        password: string | null;
        googleId: string | null;
        facebookId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    validateFacebookUser(profile: any): Promise<{
        id: string;
        email: string;
        name: string;
        password: string | null;
        googleId: string | null;
        facebookId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    generateToken(user: any): Promise<{
        access_token: string;
    }>;
}
