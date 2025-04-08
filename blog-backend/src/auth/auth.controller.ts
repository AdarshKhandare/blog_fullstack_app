import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  // Frontend URL for redirection after OAuth
  private get frontendUrl(): string {
    return this.configService.get("FRONTEND_URL") || "http://localhost:5173";
  }

  // Redirect URL for OAuth callbacks
  private get callbackUrl(): string {
    return `${this.frontendUrl}/auth/callback`;
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {
    // This endpoint initiates Google OAuth flow
    // The guard automatically redirects to Google
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const user = await this.authService.validateGoogleUser(req.user);
      const { access_token } = await this.authService.generateToken(user);
      console.log("access_token", access_token);
      // Encode user data for URL
      const userData = encodeURIComponent(
        JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
        })
      );

      // Redirect to frontend with token
      return res.redirect(
        `${this.callbackUrl}?token=${access_token}&user=${userData}`
      );
    } catch (error) {
      console.error("Google auth error:", error);
      return res.redirect(
        `${this.frontendUrl}/login?error=Authentication failed`
      );
    }
  }

  @Get("facebook")
  @UseGuards(AuthGuard("facebook"))
  async facebookAuth() {
    // This endpoint initiates Facebook OAuth flow
    // The guard automatically redirects to Facebook
  }

  @Get("facebook/callback")
  @UseGuards(AuthGuard("facebook"))
  async facebookAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const user = await this.authService.validateFacebookUser(req.user);
      const { access_token } = await this.authService.generateToken(user);

      // Encode user data for URL
      const userData = encodeURIComponent(
        JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
        })
      );

      // Redirect to frontend with token
      return res.redirect(
        `${this.callbackUrl}?token=${access_token}&user=${userData}`
      );
    } catch (error) {
      console.error("Facebook auth error:", error);
      return res.redirect(
        `${this.frontendUrl}/login?error=Authentication failed`
      );
    }
  }
}
