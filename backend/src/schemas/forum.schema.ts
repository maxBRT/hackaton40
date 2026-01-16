import { z } from "zod";
import { registry } from "../docs/openapi.registry";
import {CourseSchema} from "./course.schema";
import {UserSchema} from "./auth.schema";

export const ForumThreadSchema: any = z.object({
  id: z.string().openapi({ example: "cl01234567890abcdef" }),
  title: z.string().openapi({ example: "How to use useEffect?" }),
  content: z.string().openapi({ example: "I am struggling with useEffect cleanup functions." }),
  userId: z.string().openapi({ example: "cl01234567890abcdef" }),
  courseId: z.string().openapi({ example: "cl01234567890abcdef" }),
  createdAt: z.string(),
  updatedAt: z.string(),
  course: CourseSchema.optional(),
  user: UserSchema.optional(),
  posts: z.array(z.lazy(() => ForumPostSchema)).optional()
});

export const ForumPostSchema: any = z.object({
  id: z.string().openapi({ example: "cl01234567890abcdef" }),
  title: z.string().nullable().openapi({ example: "Re: How to use useEffect?" }),
  content: z.string().openapi({ example: "You should return a function from useEffect." }),
  userId: z.string().openapi({ example: "cl01234567890abcdef" }),
  threadId: z.string().openapi({ example: "cl01234567890abcdef" }),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: UserSchema.optional()
});

registry.registerComponent("schemas", "ForumThread", ForumThreadSchema);
registry.registerComponent("schemas", "ForumPost", ForumPostSchema);

registry.registerPath({
  method: "get",
  path: "/api/forum-threads",
  tags: ["Forum"],
  summary: "List all forum threads",
  operationId: "listForumThreads",
  security: [{ bearerAuth: [] }],
  responses:  {
    200: {
      description: "List of threads",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.array(ForumThreadSchema),
          }),
        },
      },
    },
  },
})

registry.registerPath({
  method: "get",
  path: "/api/forum-threads/courses/{id}",
  tags: ["Forum"],
  summary: "List forum threads for a course",
  operationId: "listForumThreadsForCourse",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "List of threads",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.array(ForumThreadSchema),
          }),
        },
      },
    },
  },
});

export const CreateForumThreadSchema = z.object({
  title: z.string(),
  content: z.string(),
  courseId: z.string(),
});

registry.registerPath({
  method: "post",
  path: "/api/forum-threads/courses/{id}",
  tags: ["Forum"],
  summary: "Create a forum thread",
  operationId: "createForumThread",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: CreateForumThreadSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Thread created",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: ForumThreadSchema,
          }),
        },
      },
    },
    400: { description: "Validation error" },
    404: { description: "Course not found" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/forum-threads/{id}/posts",
  tags: ["Forum"],
  summary: "List posts for a thread",
  operationId: "listForumPosts",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "List of posts",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.object({
              thread: ForumThreadSchema,
            }),
          }),
        },
      },
    },
  },
});

export const CreateForumPostSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
});

registry.registerPath({
  method: "post",
  path: "/api/forum-threads/{id}/posts",
  tags: ["Forum"],
  summary: "Create a forum post",
  operationId: "createForumPost",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: CreateForumPostSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Post created",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: ForumPostSchema,
          }),
        },
      },
    },
    400: { description: "Validation error" },
    404: { description: "Thread not found" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/forum-threads/{id}",
  tags: ["Forum"],
  summary: "Get a forum thread",
  operationId: "getForumThread",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Forum thread",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: ForumThreadSchema,
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/forum-threads/{id}",
  tags: ["Forum"],
  summary: "Update a forum thread",
  operationId: "updateForumThread",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: CreateForumThreadSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Thread updated",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: ForumThreadSchema,
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/forum-threads/{id}",
  tags: ["Forum"],
  summary: "Delete a forum thread",
  operationId: "deleteForumThread",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Thread deleted",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/forum-threads/posts/{postId}",
  tags: ["Forum"],
  summary: "Update a forum post",
  operationId: "updateForumPost",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      postId: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: CreateForumPostSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Post updated",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: ForumPostSchema,
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/forum-threads/posts/{postId}",
  tags: ["Forum"],
  summary: "Delete a forum post",
  operationId: "deleteForumPost",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      postId: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Post deleted",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
  },
});
