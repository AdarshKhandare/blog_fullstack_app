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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    constructor(configService) {
        super({
            log: ["error", "warn"],
            datasources: {
                db: {
                    url: configService.get("database.url"),
                },
            },
        });
        this.configService = configService;
        this.logger = new common_1.Logger(PrismaService_1.name);
        this.retries = 5;
    }
    async onModuleInit() {
        await this.connectWithRetry();
    }
    async connectWithRetry() {
        try {
            this.logger.log(`Connecting to database at ${this.configService.get("database.url")}...`);
            await this.$connect();
            this.logger.log("Successfully connected to database");
        }
        catch (error) {
            if (this.retries > 0) {
                this.retries -= 1;
                this.logger.error(`Failed to connect to database. ${this.retries} retries left. Error: ${error.message}`);
                await new Promise((resolve) => setTimeout(resolve, 3000));
                await this.connectWithRetry();
            }
            else {
                this.logger.error(`Failed to connect to database after multiple retries: ${error.message}`);
                throw error;
            }
        }
    }
    async onModuleDestroy() {
        this.logger.log("Disconnecting from database");
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map