"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const config_1 = require("@nestjs/config");
let AuthController = class AuthController {
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    get frontendUrl() {
        return this.configService.get("FRONTEND_URL") || "http://localhost:5173";
    }
    get callbackUrl() {
        return `${this.frontendUrl}/auth/callback`;
    }
    async googleAuth() {
    }
    async googleAuthCallback(req, res) {
        try {
            const user = await this.authService.validateGoogleUser(req.user);
            const { access_token } = await this.authService.generateToken(user);
            console.log("access_token", access_token);
            const userData = encodeURIComponent(JSON.stringify({
                id: user.id,
                email: user.email,
                name: user.name,
            }));
            return res.redirect(`${this.callbackUrl}?token=${access_token}&user=${userData}`);
        }
        catch (error) {
            console.error("Google auth error:", error);
            return res.redirect(`${this.frontendUrl}/login?error=Authentication failed`);
        }
    }
    async facebookAuth() {
    }
    async facebookAuthCallback(req, res) {
        try {
            const user = await this.authService.validateFacebookUser(req.user);
            const { access_token } = await this.authService.generateToken(user);
            const userData = encodeURIComponent(JSON.stringify({
                id: user.id,
                email: user.email,
                name: user.name,
            }));
            return res.redirect(`${this.callbackUrl}?token=${access_token}&user=${userData}`);
        }
        catch (error) {
            console.error("Facebook auth error:", error);
            return res.redirect(`${this.frontendUrl}/login?error=Authentication failed`);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)("google"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("google")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)("google/callback"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("google")),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthCallback", null);
__decorate([
    (0, common_1.Get)("facebook"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("facebook")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "facebookAuth", null);
__decorate([
    (0, common_1.Get)("facebook/callback"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("facebook")),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "facebookAuthCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map