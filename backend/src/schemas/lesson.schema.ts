import { z } from "zod";
import { registry } from "../docs/openapi.registry";

export const CreateLessonSchema = z.object({
  title: z.string().openapi({ example: "Introduction to HTML" }),
  content: z.string().openapi({ example: "HTML stands for HyperText Markup Language" }),
  moduleId: z.string().openapi({ example: "cl01234567890abcdef" }),
  position: z.number().int().optional().openapi({ example: 1 }),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).openapi({ example: "BEGINNER" }),
});

export const LessonSchema = CreateLessonSchema.extend({
  id: z.string().openapi({ example: "cl01234567890abcdef" }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const GetLessonsQuerySchema = z.object({
  courseId: z.string().optional(),
  published: z.enum(["true", "false"]).optional(),
  q: z.string().optional(),
});

registry.registerPath({
  method: "get",
  path: "/api/lessons",
  tags: ["Lessons"],
  summary: "Get all lessons",
  security: [{ bearerAuth: [] }],
  operationId: "getLessons",
  request: {
    query: GetLessonsQuerySchema,
  },
  responses: {
    200: {
      description: "List of lessons",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: z.array(LessonSchema),
            count: z.number(),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/lessons/{id}",
  tags: ["Lessons"],
  summary: "Get lesson by ID",
  security: [{ bearerAuth: [] }],
  operationId: "getLessonById",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Lesson details",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: LessonSchema,
          }),
        },
      },
    },
    404: { description: "Lesson not found" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/lessons",
  tags: ["Lessons"],
  summary: "Create a new lesson",
  security: [{ bearerAuth: [] }],
  operationId: "createLesson",
  request: {
    body: {
      content: {
        "application/json": { schema: CreateLessonSchema },
      },
    },
  },
  responses: {
    201: {
      description: "Lesson created",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: LessonSchema,
          }),
        },
      },
    },
    400: { description: "Validation error" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/lessons/{id}/complete",
  tags: ["Lessons"],
  summary: "Mark a lesson as completed",
  security: [{ bearerAuth: [] }],
  operationId: "completeLesson",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Lesson marked as completed",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.object({
              progress: z.any(),
              user: z.any(),
              xpAdded: z.number(),
            }),
          }),
        },
      },
    },
    401: { description: "Unauthorized" },
    404: { description: "Lesson not found" },
  },
});
