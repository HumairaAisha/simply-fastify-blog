import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Static } from "@sinclair/typebox";
import {
  RegisterUserSchema,
  LoginUserSchema,
  ForgotPasswordSchema,
  LogoutSchema,
  ResetPasswordSchema,
} from "./auth.schemas";
import { sendEmail } from "src/utils/mail";
import { prisma } from "src/utils/prisma";
import { FastifyRequest } from "fastify/types/request";
import { configDotenv } from "dotenv";

export type RegisterUserType = Static<typeof RegisterUserSchema>;
export type LoginUserType = Static<typeof LoginUserSchema>;
export type LogoutType = Static<typeof LogoutSchema>;
export type ForgotPasswordType = Static<typeof ForgotPasswordSchema>;
export type ResetPasswordType = Static<typeof ResetPasswordSchema>;

configDotenv();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret";

export async function decodeToken(request: FastifyRequest) {
  const token = request.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new Error("No token provided");
  }
  const decoded = jwt.verify(token, JWT_SECRET as string) as unknown as {
    id: number;
    email: string;
    role: string;
  };

  return decoded;
}

export async function registerUser(
  userData: RegisterUserType,
  role: "ADMIN" | "VIEWER"
) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (existingUser) throw new Error("Email already in use");

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await prisma.user.create({
      data: {
        ...userData,
        role,
        password: hashedPassword,
      },
    });

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function createSuperAdmin(userData: RegisterUserType) {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (existingUser) return console.error("Super admin already exists");

  await registerUser(userData, "ADMIN");
  console.log("Super Admin created successfully");
}

export async function loginUser({ email, password }: LoginUserType) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Store refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email },
    };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function refreshAccessToken(oldRefreshToken: string) {
  try {
    const payload = jwt.verify(oldRefreshToken, JWT_REFRESH_SECRET) as {
      id: number;
    };

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || user.refreshToken !== oldRefreshToken) {
      throw new Error("Invalid or reused refresh token");
    }

    // Create new tokens
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const newRefreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    // Store new refresh token and invalidate the old one
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: { id: user.id, email: user.email },
    };
  } catch (error) {
    console.error("Refresh error:", error);
    throw new Error("Invalid refresh token");
  } finally {
    await prisma.$disconnect();
  }
}

export async function logoutUser(userId: number) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: "Logged out successfully" };
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  const resetLink = `${process.env.APP_NAME}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Password Reset",
    html: `
      <p>Hi ${user.name},</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  });

  return { message: "Password reset email sent" };
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
    });

    return { message: "Password reset successful" };
  } catch {
    throw new Error("Invalid or expired token");
  }
}
