import { z } from "zod";
import { registry } from "../docs/openapi.registry";
import { CourseSchema } from "./course.schema";

export const CourseUserSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  completed: z.boolean(),
  completedAt: z.string().datetime().nullable(),
  course: CourseSchema.optional(),
});

registry.registerPath({
  method: "get",
  path: "/api/enroll/me",
  tags: ["Enrollment"],
  summary: "Get enrolled courses for current user",
  operationId: "enrolledList",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "List of enrolled courses",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: z.array(CourseUserSchema),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/enroll/{id}",
  tags: ["Enrollment"],
  summary: "Enroll in a course",
  operationId: "enroll",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    201: {
      description: "Successfully enrolled",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    400: { description: "Invalid course ID" },
    404: { description: "Course or user not found" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/enroll/unenroll/{id}",
  tags: ["Enrollment"],
  summary: "Unenroll from a course",
  operationId: "unenroll",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Successfully unenrolled",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    404: { description: "Course or enrollment not found" },
  },
});
