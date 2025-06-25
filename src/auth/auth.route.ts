import { FastifyInstance } from "fastify";
import {
  registerUser,
  loginUser,
  RegisterUserType,
  LoginUserType,
  logoutUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
} from "./auth.controller";
import {
  RegisterUserSchema,
  LoginUserSchema,
  ForgotPasswordSchema,
  LogoutSchema,
  ResetPasswordSchema,
} from "./auth.schemas";
import { getErrorMessage } from "src/utils/error";
import { requireAdmin, verifyToken } from "./auth.middleware";

async function authRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: RegisterUserType }>(
    "/register",
    { schema: RegisterUserSchema },
    async (request, reply) => {
      try {
        const user = await registerUser(request.body, "VIEWER");
        return { message: "User registered", data: user };
      } catch (error) {
        request.log.error(error);
        reply.status(400).send({
          message: "Registration failed",
          error: getErrorMessage(error),
        });
      }
    }
  );

  fastify.post<{ Body: RegisterUserType }>(
    "/register-admin",
    { schema: RegisterUserSchema, preHandler: [verifyToken, requireAdmin] },
    async (request, reply) => {
      try {
        const user = await registerUser(request.body, "ADMIN");
        return { message: "Admin registered", data: user };
      } catch (error) {
        request.log.error(error);
        reply.status(400).send({
          message: "Registration failed",
          error: getErrorMessage(error),
        });
      }
    }
  );

  fastify.post<{ Body: LoginUserType }>(
    "/login",
    { schema: LoginUserSchema },
    async (request, reply) => {
      try {
        const result = await loginUser(request.body);

        // Set HTTP-only cookie for refresh token
        reply.setCookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        });

        return {
          message: "Login successful",
          accessToken: result.accessToken,
          user: result.user,
        };
      } catch (error) {
        request.log.error(error);
        reply.status(401).send({
          message: "Login failed",
          error: getErrorMessage(error),
        });
      }
    }
  );

  fastify.post("/refresh", async (request, reply) => {
    try {
      const oldToken = request.cookies.refreshToken;
      if (!oldToken) {
        throw new Error("Missing refresh token");
      }

      const { accessToken, refreshToken, user } =
        await refreshAccessToken(oldToken);

      // Set new HTTP-only cookie
      reply.setCookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      });

      return {
        message: "Token refreshed",
        accessToken,
        user,
      };
    } catch (error) {
      request.log.error(error);
      reply.status(401).send({
        message: "Token refresh failed",
        error: getErrorMessage(error),
      });
    }
  });

  fastify.post<{ Body: { userId: number } }>(
    "/logout",
    { schema: LogoutSchema },
    async (request, reply) => {
      try {
        const { userId } = request.body;
        const result = await logoutUser(userId);

        // Clear the refresh token cookie
        reply.clearCookie("refreshToken", {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        return { message: "Logout successful", data: result };
      } catch (error) {
        request.log.error(error);
        reply.status(500).send({
          message: "Logout failed",
          error: getErrorMessage(error),
        });
      }
    }
  );

  fastify.post<{ Body: { email: string } }>(
    "/forgot-password",
    { schema: ForgotPasswordSchema },
    async (request, reply) => {
      try {
        const { email } = request.body;
        const result = await forgotPassword(email);
        return result;
      } catch (error) {
        request.log.error(error);
        reply.status(400).send({
          message: "Failed to send password reset email",
          error: getErrorMessage(error),
        });
      }
    }
  );

  fastify.post<{ Body: { token: string; newPassword: string } }>(
    "/reset-password",
    { schema: ResetPasswordSchema },
    async (request, reply) => {
      try {
        const { token, newPassword } = request.body;
        const result = await resetPassword(token, newPassword);
        return result;
      } catch (error) {
        request.log.error(error);
        reply.status(400).send({
          message: "Password reset failed",
          error: getErrorMessage(error),
        });
      }
    }
  );
}

export default authRoutes;
