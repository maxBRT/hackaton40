import { z } from "zod";
import { registry } from "../docs/openapi.registry";
import { IdParamSchema } from "./common.schema";

export const LoginSchema = z.object({
  email: z.string().openapi({ example: "user@example.com" }),
  password: z.string().min(5).openapi({ example: "password123" }),
});

export const RegisterSchema = LoginSchema.extend({
  username: z.string().min(3).openapi({ example: "johndoe" }),
});

export const UserSchema = z.object({
  id: z.string().openapi({ example: "cl01234567890abcdef" }),
  username: z.string().openapi({ example: "johndoe" }),
  email: z.string().openapi({ example: "user@example.com" }),
  role: z.enum(["USER", "ADMIN"]).openapi({ example: "USER" }),
  currentExp: z.number().openapi({ example: 100 }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

registry.registerPath({
  method: "post",
  path: "/api/auth/login",
  tags: ["Auth"],
  summary: "Login a user",
  operationId: "login",
  request: {
    body: {
      content: {
        "application/json": { schema: LoginSchema },
      },
    },
  },
  responses: {
    200: {
      description: "Successfully logged in",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.object({
              token: z.string(),
            }),
          }),
        },
      },
    },
    401: { description: "Invalid credentials" },
    404: { description: "User not found" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/auth/register",
  tags: ["Auth"],
  summary: "Register a new user",
  operationId: "register",
  request: {
    body: {
      content: {
        "application/json": { schema: RegisterSchema },
      },
    },
  },
  responses: {
    201: {
      description: "User created successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.object({
              user: UserSchema,
              token: z.string(),
            }),
          }),
        },
      },
    },
    400: { description: "Validation error or user already exists" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/auth/me",
  tags: ["Auth"],
  summary: "Get current user info",
  operationId: "userInfo",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "User info fetched successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.object({
              userId: z.string(),
              username: z.string(),
              userEmail: z.string(),
              role: z.string(),
              currentExp: z.number(),
              userCourses: z.array(z.any()),
              lessonProgresses: z.array(z.any()),
            }),
          }),
        },
      },
    },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/auth/{id}",
  tags: ["Auth"],
  summary: "Get user info by id",
  operationId: "getUserInfo",
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      description: "User info fetched successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: UserSchema,
          }),
        },
      },
    },
    404: { description: "User not found" },
  },
});
