import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";

// Extended Request type that includes our user
interface RequestWithUser extends Request {
  user: { id: string };
}

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createPostDto: { title: string; content: string },
    @Req() req: RequestWithUser
  ) {
    return this.postsService.createPost({
      ...createPostDto,
      authorId: req.user.id,
    });
  }

  @Get()
  async findAll() {
    const posts = await this.postsService.getPosts();
    console.log("posts", posts);
    return posts;
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const post = await this.postsService.getPostById(id);
    if (!post) {
      throw new NotFoundException("Post not found");
    }
    return post;
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  update(
    @Param("id") id: string,
    @Body() updatePostDto: { title?: string; content?: string },
    @Req() req: RequestWithUser
  ) {
    return this.postsService.updatePost(id, updatePostDto, req.user.id);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  remove(@Param("id") id: string, @Req() req: RequestWithUser) {
    return this.postsService.deletePost(id, req.user.id);
  }

  @Get("user/posts")
  @UseGuards(JwtAuthGuard)
  getUserPosts(@Req() req: RequestWithUser) {
    return this.postsService.getUserPosts(req.user.id);
  }
}
