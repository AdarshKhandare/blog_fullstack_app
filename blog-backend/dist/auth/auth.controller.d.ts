import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    private get frontendUrl();
    private get callbackUrl();
    googleAuth(): Promise<void>;
    googleAuthCallback(req: Request, res: Response): Promise<void>;
    facebookAuth(): Promise<void>;
    facebookAuthCallback(req: Request, res: Response): Promise<void>;
}
