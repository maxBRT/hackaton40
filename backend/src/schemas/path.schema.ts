import { z } from "zod";
import { registry } from "../docs/openapi.registry";

export const LearningPathSchema = z.object({
  id: z.string().openapi({ example: "cl01234567890abcdef" }),
  title: z.string().openapi({ example: "Fullstack Developer" }),
  description: z.string().nullable().openapi({ example: "Complete path to become a fullstack developer" }),
  author: z.string().openapi({ example: "John Doe" }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

registry.registerPath({
  method: "get",
  path: "/api/learning-paths",
  tags: ["Learning Paths"],
  summary: "Get all learning paths",
  operationId: "getLearningPaths",
  responses: {
    200: {
      description: "List of learning paths",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: z.array(LearningPathSchema),
          }),
        },
      },
    },
    500: { description: "Internal server error" },
  },
});
