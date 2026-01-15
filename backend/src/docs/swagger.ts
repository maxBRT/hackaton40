import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { generateOpenApiDocument } from "./openapi";

export const swaggerRouter = Router();

swaggerRouter.get("/openapi.json", (_req, res) => {
  res.json(generateOpenApiDocument());
});

// Serve swagger UI HTML that explicitly points at your spec URL
swaggerRouter.get("/docs", (_req, res) => {
  const html = swaggerUi.generateHTML(undefined, {
    swaggerOptions: {
      url: "/api/openapi.json",
    },
  });
  res.send(html);
});

// Serve swagger assets (css/js)
swaggerRouter.use("/docs", swaggerUi.serve);
