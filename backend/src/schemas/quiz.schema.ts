import { z } from "zod";
import { registry } from "../docs/openapi.registry";

export const QuestionSchema = z.object({
  id: z.number().int().optional(),
  question: z.string().openapi({ example: "What is React?" }),
  answers: z.array(z.string()).openapi({ example: ["A library", "A framework", "A language"] }),
  correctAnswer: z.number().int().openapi({ example: 0 }),
});

export const CreateQuizSchema = z.object({
  title: z.string().openapi({ example: "React Basics Quiz" }),
  description: z.string().openapi({ example: "Test your knowledge of React fundamentals" }),
  questions: z.array(QuestionSchema),
});

export const QuizSchema = CreateQuizSchema.extend({
  id: z.string().openapi({ example: "cl01234567890abcdef" }),
  lessonId: z.string().openapi({ example: "cl01234567890abcdef" }),
  status: z.boolean().default(false),
});

registry.registerPath({
  method: "get",
  path: "/api/quiz/lessons/{id}",
  tags: ["Quiz"],
  summary: "Get quiz for a lesson",
  operationId: "getQuiz",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Quiz details",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: z.array(QuizSchema),
          }),
        },
      },
    },
    404: { description: "Lesson not found" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/quiz/lessons/{id}",
  tags: ["Quiz"],
  summary: "Create a quiz for a lesson",
  operationId: "createQuiz",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        "application/json": { schema: CreateQuizSchema },
      },
    },
  },
  responses: {
    201: {
      description: "Quiz created",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: QuizSchema,
          }),
        },
      },
    },
    400: { description: "Validation error" },
    403: { description: "Forbidden - Admin only" },
  },
});
