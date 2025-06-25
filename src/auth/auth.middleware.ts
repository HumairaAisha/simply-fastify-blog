import { User } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function verifyToken(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("UNAUTHORIZED");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      role: string;
    };

    request.user = decoded;
  } catch (error) {
    if (error instanceof Error) {
      const statusCode = error.message === "UNAUTHORIZED" ? 401 : 401;
      const message =
        error.message === "UNAUTHORIZED"
          ? "Unauthorized"
          : "Invalid or expired token";

      reply.status(statusCode).send({ message });
      return;
    }
    reply.status(401).send({ message: "Authentication failed" });
  }
}

export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if (!request.user || (request.user as User).role !== "ADMIN") {
    reply.status(403).send({ message: "Admins only" });
    return;
  }
}
