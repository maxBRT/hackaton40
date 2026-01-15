import { z } from "zod";
import { registry } from "../docs/openapi.registry";

export const ForumThreadSchema = z.object({
  id: z.string().openapi({ example: "cl01234567890abcdef" }),
  title: z.string().openapi({ example: "How to use useEffect?" }),
  content: z.string().openapi({ example: "I am struggling with useEffect cleanup functions." }),
  userId: z.string().openapi({ example: "cl01234567890abcdef" }),
  courseId: z.string().openapi({ example: "cl01234567890abcdef" }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ForumPostSchema = z.object({
  id: z.string().openapi({ example: "cl01234567890abcdef" }),
  title: z.string().nullable().openapi({ example: "Re: How to use useEffect?" }),
  content: z.string().openapi({ example: "You should return a function from useEffect." }),
  userId: z.string().openapi({ example: "cl01234567890abcdef" }),
  threadId: z.string().openapi({ example: "cl01234567890abcdef" }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

registry.registerPath({
  method: "get",
  path: "/api/forum-threads/courses/{id}",
  tags: ["Forum"],
  summary: "List forum threads for a course",
  operationId: "listForumThreads",
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
            status: z.string(),
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
            status: z.string(),
            data: ForumThreadSchema,
          }),
        },
      },
    },
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
            status: z.string(),
            data: z.object({
              thread: ForumThreadSchema.extend({ posts: z.array(ForumPostSchema) }),
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
            status: z.string(),
            data: ForumPostSchema,
          }),
        },
      },
    },
  },
});
