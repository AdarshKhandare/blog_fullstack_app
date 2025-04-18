import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: any): Promise<{
        id: string;
        email: string;
        name: string;
        password: string | null;
        googleId: string | null;
        facebookId: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
export {};
