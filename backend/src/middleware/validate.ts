import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

type ValidationTargets = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

export function validate(schemas: ValidationTargets | ZodSchema, property: "body" | "query" | "params" = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const targets: ValidationTargets =
      typeof (schemas as any).safeParse === "function"
        ? { [property]: schemas as ZodSchema }
        : (schemas as ValidationTargets);

    for (const [prop, schema] of Object.entries(targets)) {
      const result = (schema as ZodSchema).safeParse(req[prop as keyof ValidationTargets]);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          errors: result.error,
        });
      }

      if (prop === "body" || prop === "query" || prop === "params") {
        req[prop] = result.data;
      }
    }

    next();
  };
}
