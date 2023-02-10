import express from 'express';
import { Request, Response, NextFunction } from 'express';
import InfoController from '../app/Http/Controllers/InfoController';
import DocumentationBasicAuthMiddleware from '../app/Http/Middlewares/DocumentationBasicAuthMiddleware';
import authRoutes from './auth';
const router = express.Router();

const infoController = new InfoController();

router.get(`/api/data`, (request: Request, response: Response, next: NextFunction) => {
    infoController.fetchFilters(request, response, next);
});

router.get(`/api/data/search`, (request: Request, response: Response, next: NextFunction) => {
    infoController.searchRequest(request, response, next);
});

const API_VERSION = 'v1';
router.use(`/api/${API_VERSION}`, authRoutes);

// Documentation
const documentaionBasicAuthMiddleware = new DocumentationBasicAuthMiddleware();
router.use('/docs', [
    documentaionBasicAuthMiddleware.handle,
    express.static(process.cwd() + '/docs', { index: 'index.html' })
]);

export default router;
