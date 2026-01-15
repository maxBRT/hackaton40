import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { generateOpenApiDocument } from "../docs/openapi";

const swaggerRouter = Router();

swaggerRouter.use("/docs", swaggerUi.serve);

swaggerRouter.get("/openapi.json", (_req, res) => {
  res.json(generateOpenApiDocument());
});

swaggerRouter.get("/docs", (_req, res) => {
  const html = swaggerUi.generateHTML(undefined, {
    swaggerOptions: {
      url: "/api/openapi.json",
    },
  });
  res.send(html);
});

export default swaggerRouter;