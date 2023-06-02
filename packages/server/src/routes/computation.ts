import express from 'express';
import { Request, Response, NextFunction } from 'express';
import ComputationController from '../app/Http/Controllers/ComputationController';

const router = express.Router();

const computationController = new ComputationController();

router.get(`/ml/model/siteText`, (request: Request, response: Response, next: NextFunction) => {
    computationController.fetchApiData(request, response, next);
});

export default router;