import { Module } from "@nestjs/common";

import { PostsController } from "./posts.controller";
import { PrismaService } from "../prisma/prisma.service";
import { PostsService } from "./posts.service";

@Module({
  controllers: [PostsController],
  providers: [PostsService, PrismaService],
})
export class PostsModule {}
