import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const IdParamSchema = z.object({
  id: z.string().openapi({ example: "cl01234567890abcdef" }),
});

export const PostIdParamSchema = z.object({
  postId: z.string().openapi({ example: "cl01234567890abcdef" }),
});
