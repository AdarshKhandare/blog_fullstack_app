import { PostsService } from "./posts.service";
import { Request } from "express";
interface RequestWithUser extends Request {
    user: {
        id: string;
    };
}
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: {
        title: string;
        content: string;
    }, req: RequestWithUser): Promise<{
        id: string;
        title: string;
        content: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
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
    findOne(id: string): Promise<{
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
    }>;
    update(id: string, updatePostDto: {
        title?: string;
        content?: string;
    }, req: RequestWithUser): Promise<{
        id: string;
        title: string;
        content: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, req: RequestWithUser): Promise<{
        id: string;
        title: string;
        content: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserPosts(req: RequestWithUser): Promise<({
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
export {};
