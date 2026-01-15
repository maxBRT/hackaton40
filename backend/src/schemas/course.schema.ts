import { z } from "zod";
import { registry } from "../docs/openapi.registry";

export const CreateCourseSchema = z.object({
  title: z.string().min(3),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  isPublished: z.boolean().default(false),
});

export const CourseSchema = CreateCourseSchema.extend({
  id: z.string(), // or z.number()
});

// This is the OpenAPI registration (runs on import)
registry.registerPath({
  method: "post",
  path: "/api/courses",
  tags: ["Courses"],
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
      description: "Course created",
      content: {
        "application/json": { schema: CourseSchema },
      },
    },
    400: { description: "Validation error" },
  },
});
