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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async validateGoogleUser(profile) {
        this.logger.log(`Google profile: ${JSON.stringify(profile, null, 2)}`);
        const googleId = profile.id || profile.sub;
        const email = profile.email || (profile.emails && profile.emails[0]?.value);
        const name = profile.displayName ||
            profile.name ||
            (profile.firstName && profile.lastName
                ? `${profile.firstName} ${profile.lastName}`
                : email.split("@")[0]);
        if (!googleId || !email) {
            throw new Error("Invalid Google profile data");
        }
        try {
            let user = await this.prisma.user.findUnique({
                where: { googleId },
            });
            console.log("user", user);
            if (!user) {
                user = await this.prisma.user.findUnique({
                    where: { email },
                });
                if (user) {
                    try {
                        user = await this.prisma.user.update({
                            where: { id: user.id },
                            data: { googleId },
                        });
                    }
                    catch (error) {
                        this.logger.error(`Failed to update user with googleId: ${error.message}`);
                    }
                }
                else {
                    try {
                        user = await this.prisma.user.create({
                            data: {
                                email,
                                name,
                                googleId,
                            },
                        });
                    }
                    catch (error) {
                        this.logger.error(`Failed to create user: ${error.message}`);
                        if (error.code === "P2002") {
                            try {
                                user = await this.prisma.user.create({
                                    data: {
                                        email,
                                        name,
                                    },
                                });
                                await this.prisma.user.update({
                                    where: { id: user.id },
                                    data: { googleId },
                                });
                            }
                            catch (secondError) {
                                this.logger.error(`Failed in fallback user creation: ${secondError.message}`);
                                throw secondError;
                            }
                        }
                        else {
                            throw error;
                        }
                    }
                }
            }
            return user;
        }
        catch (error) {
            this.logger.error(`Error in validateGoogleUser: ${error.message}`);
            throw error;
        }
    }
    async validateFacebookUser(profile) {
        this.logger.log(`Facebook profile: ${JSON.stringify(profile, null, 2)}`);
        const facebookId = profile.id;
        const email = profile.emails?.[0]?.value || `${facebookId}@facebook.com`;
        const name = profile.displayName ||
            (profile.name
                ? `${profile.name.givenName} ${profile.name.familyName}`
                : email.split("@")[0]);
        if (!facebookId) {
            throw new Error("Invalid Facebook profile data");
        }
        try {
            let user = await this.prisma.user.findUnique({
                where: { facebookId },
            });
            if (!user) {
                user = await this.prisma.user.findUnique({
                    where: { email },
                });
                if (user) {
                    try {
                        user = await this.prisma.user.update({
                            where: { id: user.id },
                            data: { facebookId },
                        });
                    }
                    catch (error) {
                        this.logger.error(`Failed to update user with facebookId: ${error.message}`);
                    }
                }
                else {
                    try {
                        user = await this.prisma.user.create({
                            data: {
                                email,
                                name,
                                facebookId,
                            },
                        });
                    }
                    catch (error) {
                        this.logger.error(`Failed to create user: ${error.message}`);
                        if (error.code === "P2002") {
                            try {
                                user = await this.prisma.user.create({
                                    data: {
                                        email,
                                        name,
                                    },
                                });
                                await this.prisma.user.update({
                                    where: { id: user.id },
                                    data: { facebookId },
                                });
                            }
                            catch (secondError) {
                                this.logger.error(`Failed in fallback user creation: ${secondError.message}`);
                                throw secondError;
                            }
                        }
                        else {
                            throw error;
                        }
                    }
                }
            }
            return user;
        }
        catch (error) {
            this.logger.error(`Error in validateFacebookUser: ${error.message}`);
            throw error;
        }
    }
    async generateToken(user) {
        this.logger.log(`Generating token for user: ${user.id}`);
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map