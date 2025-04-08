import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(data: { title: string; content: string; authorId: string }) {
    return this.prisma.post.create({
      data,
    });
  }

  async getPosts() {
    return this.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getPostById(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updatePost(
    id: string,
    data: { title?: string; content?: string },
    userId: string
  ) {
    return this.prisma.post.update({
      where: { id, authorId: userId },
      data,
    });
  }

  async deletePost(id: string, userId: string) {
    return this.prisma.post.delete({
      where: { id, authorId: userId },
    });
  }

  async getUserPosts(userId: string) {
    return this.prisma.post.findMany({
      where: { authorId: userId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
