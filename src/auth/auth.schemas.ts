import { Type } from "@sinclair/typebox";

export const RegisterUserSchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 6 }),
  name: Type.String(),
});

export const LoginUserSchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 6 }),
});

export const LogoutSchema = Type.Object({
  userId: Type.Number(),
});

export const ForgotPasswordSchema = Type.Object({
  email: Type.String({ format: "email" }),
});

export const ResetPasswordSchema = Type.Object({
  token: Type.String(),
  newPassword: Type.String({ minLength: 6 }),
});
