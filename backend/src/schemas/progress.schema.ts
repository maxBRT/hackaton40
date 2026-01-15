import { z } from "zod";
import { registry } from "../docs/openapi.registry";

export const CourseProgressSchema = z.object({
  courseId: z.string().openapi({ example: "cl01234567890abcdef" }),
  totalLessons: z.number().int().openapi({ example: 10 }),
  completedLessons: z.number().int().openapi({ example: 5 }),
  percent: z.number().int().openapi({ example: 50 }),
  status: z.enum(["IN_PROGRESS", "COMPLETED"]).openapi({ example: "IN_PROGRESS" }),
});

registry.registerPath({
  method: "get",
  path: "/api/progress/courses/{id}/progress",
  tags: ["Progress"],
  summary: "Get progress for a course",
  operationId: "getCourseProgress",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Progress details",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: CourseProgressSchema,
          }),
        },
      },
    },
    401: { description: "Unauthorized" },
  },
});
