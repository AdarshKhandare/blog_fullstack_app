import { PrismaService } from "../prisma/prisma.service";
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    createPost(data: {
        title: string;
        content: string;
        authorId: string;
    }): Promise<{
        id: string;
        title: string;
        content: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getPosts(): Promise<({
        author: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        title: string;
        content: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getPostById(id: string): Promise<({
        author: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        title: string;
        content: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    updatePost(id: string, data: {
        title?: string;
        content?: string;
    }, userId: string): Promise<{
        id: string;
        title: string;
        content: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deletePost(id: string, userId: string): Promise<{
        id: string;
        title: string;
        content: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserPosts(userId: string): Promise<({
        author: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        title: string;
        content: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
