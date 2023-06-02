import express from "express";
import DocumentationBasicAuthMiddleware from "../app/Http/Middlewares/DocumentationBasicAuthMiddleware";
import authRoutes from "./auth";
import crawlerRoutes from "./crawler";
import parserRoutes from "./parser";
import siteRoutes from "./site";
import mlRoutes from "./computation";

const router = express.Router();

const API_VERSION = "v1";
router.use(`/api/${API_VERSION}`, authRoutes);
router.use(`/api/${API_VERSION}`, crawlerRoutes);
router.use(`/api/${API_VERSION}`, parserRoutes);
router.use(`/api/${API_VERSION}`, siteRoutes);
router.use(`/api/${API_VERSION}`, mlRoutes);

// Documentation
const documentaionBasicAuthMiddleware = new DocumentationBasicAuthMiddleware();
router.use("/docs", [
    documentaionBasicAuthMiddleware.handle,
    express.static(process.cwd() + "/docs", { index: "index.html" }),
]);

export default router;
