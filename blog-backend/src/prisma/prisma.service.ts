import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private retries = 5;

  constructor(private configService: ConfigService) {
    super({
      log: ["error", "warn"],
      datasources: {
        db: {
          url: configService.get("database.url"),
        },
      },
    });
  }

  async onModuleInit() {
    await this.connectWithRetry();
  }

  async connectWithRetry() {
    try {
      this.logger.log(
        `Connecting to database at ${this.configService.get("database.url")}...`
      );
      await this.$connect();
      this.logger.log("Successfully connected to database");
    } catch (error) {
      if (this.retries > 0) {
        this.retries -= 1;
        this.logger.error(
          `Failed to connect to database. ${this.retries} retries left. Error: ${error.message}`
        );

        // Wait for 3 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await this.connectWithRetry();
      } else {
        this.logger.error(
          `Failed to connect to database after multiple retries: ${error.message}`
        );
        throw error;
      }
    }
  }

  async onModuleDestroy() {
    this.logger.log("Disconnecting from database");
    await this.$disconnect();
  }
}
