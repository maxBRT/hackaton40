import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../docs/openapi.registry";

extendZodWithOpenApi(z);

export const CreateCourseSchema = z.object({
  title: z.string().min(3).openapi({ example: "Introduction to React" }),
  description: z.string().min(10).openapi({ example: "Learn the basics of React development" }),
  category: z.string().optional().openapi({ example: "Web Development" }),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
  isPublished: z.boolean().default(false),
  learningPathId: z.string().openapi({ example: "cl01234567890abcdef" }),
});

export const CourseSchema = CreateCourseSchema.extend({
  id: z.string().openapi({ example: "cl01234567890abcdef" }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Paths registration
registry.registerPath({
  method: "post",
  path: "/api/courses",
  tags: ["Courses"],
  summary: "Create a new course",
  operationId: "createCourse",
  request: {
    body: {
      content: {
        "application/json": { schema: CreateCourseSchema },
      },
    },
  },
  responses: {
    201: {
      description: "Course created successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: CourseSchema,
          }),
        },
      },
    },
    400: { description: "Validation error" },
    401: { description: "Unauthorized" },
    403: { description: "Forbidden - Admin only" },
  },
});

export const GetCoursesQuerySchema = z.object({
  pathId: z.string().optional(),
  category: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  published: z.enum(["true", "false"]).optional(),
  q: z.string().optional(),
});

registry.registerPath({
  method: "get",
  path: "/api/courses",
  tags: ["Courses"],
  summary: "Get all courses",
  operationId: "getCourses",
  request: {
    query: GetCoursesQuerySchema,
  },
  responses: {
    200: {
      description: "List of courses",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: z.array(CourseSchema),
          }),
        },
      },
    },
    500: { description: "Internal server error" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/courses/{id}",
  tags: ["Courses"],
  summary: "Get course by ID",
  operationId: "getCourseById",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Course details",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: CourseSchema,
          }),
        },
      },
    },
    404: { description: "Course not found" },
  },
});
