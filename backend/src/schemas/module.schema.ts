import { z } from "zod";
import { registry } from "../docs/openapi.registry";

export const CreateModuleSchema = z.object({
  title: z.string().openapi({ example: "Getting Started" }),
  position: z.number().int().openapi({ example: 1 }),
  courseId: z.string().openapi({ example: "cl01234567890abcdef" }),
});

export const ModuleSchema = CreateModuleSchema.extend({
  id: z.string().openapi({ example: "cl01234567890abcdef" }),
});

export const GetModulesQuerySchema = z.object({
  courseId: z.string().optional(),
});

registry.registerPath({
  method: "get",
  path: "/api/modules",
  tags: ["Modules"],
  summary: "Get all modules",
  operationId: "getModules",
  request: {
    query: GetModulesQuerySchema,
  },
  responses: {
    200: {
      description: "List of modules",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: z.array(ModuleSchema),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/modules/{id}",
  tags: ["Modules"],
  summary: "Get module by ID",
  operationId: "getModuleById",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Module details",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: ModuleSchema,
          }),
        },
      },
    },
    404: { description: "Module not found" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/modules",
  tags: ["Modules"],
  summary: "Create a new module",
  operationId: "createModule",
  request: {
    body: {
      content: {
        "application/json": { schema: CreateModuleSchema },
      },
    },
  },
  responses: {
    201: {
      description: "Module created",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: ModuleSchema,
          }),
        },
      },
    },
    400: { description: "Validation error" },
    403: { description: "Forbidden - Admin only" },
  },
});

export const UpdateModuleSchema = CreateModuleSchema.partial();

registry.registerPath({
  method: "patch",
  path: "/api/modules/{id}",
  tags: ["Modules"],
  summary: "Update a module",
  operationId: "updateModule",
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: UpdateModuleSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Module updated",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: ModuleSchema,
          }),
        },
      },
    },
    400: { description: "Validation error" },
    404: { description: "Module not found" },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/modules/{id}",
  tags: ["Modules"],
  summary: "Delete a module",
  operationId: "deleteModule",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Module deleted",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    404: { description: "Module not found" },
  },
});
