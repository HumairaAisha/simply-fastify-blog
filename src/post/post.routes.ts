import { FastifyInstance } from "fastify";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getAllMyPosts,
} from "./post.controller";
import { getErrorMessage } from "src/utils/error";
import { requireAdmin, verifyToken } from "src/auth/auth.middleware";
import { PostSchema } from "./post.schemas";
import { decodeToken } from "src/auth/auth.controller";

async function postRoutes(fastify: FastifyInstance) {
  fastify.post<{
    Body: {
      title: string;
      content: string;
      userId: number;
    };
  }>(
    "/",
    { schema: PostSchema, preHandler: [verifyToken, requireAdmin] },
    async (request, reply) => {
      try {
        const { id: userId } = await decodeToken(request);
        const post = await createPost({ ...request.body, userId });

        return { message: "Post created", data: post };
      } catch (err) {
        request.log.error(err);
        reply.status(400).send({
          message: "Failed to create post",
          error: getErrorMessage(err),
        });
      }
    }
  );

  // List Posts
  fastify.get<{ Querystring: { page?: number; perPage?: number } }>(
    "/",
    { preHandler: [verifyToken] },
    async (request, reply) => {
      try {
        const { page = 1, perPage = 10 } = request.query as any;
        const result = await getAllPosts(page, perPage);
        return {
          message: "success",
          data: result.data,
          pagination: result.pagination,
        };
      } catch (err) {
        request.log.error(err);
        reply.status(500).send({
          message: "Failed to fetch posts",
          error: getErrorMessage(err),
        });
      }
    }
  );

  fastify.get<{ Querystring: { page?: number; perPage?: number } }>(
    "/mine",
    { preHandler: [verifyToken] },
    async (request, reply) => {
      try {
        const { page = 1, perPage = 10 } = request.query as any;
        const { id: userId } = await decodeToken(request);
        const result = await getAllMyPosts(userId, page, perPage);
        return {
          message: "success",
          data: result.data,
          pagination: result.pagination,
        };
      } catch (err) {
        request.log.error(err);
        reply.status(500).send({
          message: "Failed to fetch posts",
          error: getErrorMessage(err),
        });
      }
    }
  );

  // Get Single Post
  fastify.get<{ Params: { id: number } }>(
    "/:id",
    { preHandler: [verifyToken] },
    async (request, reply) => {
      try {
        const postId = Number(request.params.id);
        if (isNaN(postId))
          return reply.status(400).send({ message: "Invalid ID parameter" });
        const post = await getPostById(postId);
        return { message: "success", data: post };
      } catch (err) {
        request.log.error(err);
        const code = getErrorMessage(err) === "Post not found" ? 404 : 500;
        reply.status(code).send({
          message: "Failed to fetch post",
          error: getErrorMessage(err),
        });
      }
    }
  );

  // Update Post
  fastify.put<{
    Params: { id: number };
    Body: Partial<{
      title: string;
      content: string;
    }>;
  }>(
    "/:id",
    { schema: PostSchema, preHandler: [verifyToken, requireAdmin] },
    async (request, reply) => {
      try {
        const postId = Number(request.params.id);
        const { id: userId } = await decodeToken(request);
        if (isNaN(postId))
          return reply.status(400).send({ message: "Invalid ID parameter" });
        const updated = await updatePost(postId, userId, request.body);
        return { message: "Post updated", data: updated };
      } catch (err) {
        request.log.error(err);
        reply.status(400).send({
          message: "Failed to update post",
          error: getErrorMessage(err),
        });
      }
    }
  );

  // Delete Post
  fastify.delete<{ Params: { id: number } }>(
    "/:id",
    { preHandler: [verifyToken, requireAdmin] },
    async (request, reply) => {
      try {
        const postId = Number(request.params.id);
        const { id: userId } = await decodeToken(request);
        if (isNaN(postId))
          return reply.status(400).send({ message: "Invalid ID parameter" });
        const result = await deletePost(postId, userId);
        return result;
      } catch (err) {
        request.log.error(err);
        reply.status(400).send({
          message: "Failed to delete post",
          error: getErrorMessage(err),
        });
      }
    }
  );
}

export default postRoutes;
