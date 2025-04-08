import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private configService;
    private readonly logger;
    private retries;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    connectWithRetry(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
