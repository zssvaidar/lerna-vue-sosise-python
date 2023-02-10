import express from 'express';
import { Request, Response, NextFunction } from 'express';
import UserController from '../app/Http/Controllers/UserController';

const router = express.Router();

// IndexController
const userController = new UserController();

router.get(`/auth`, (request: Request, response: Response, next: NextFunction) => {
    userController.authorizeToken(request, response, next);
});

router.post(`/user/auth`, (request: Request, response: Response, next: NextFunction) => {
    userController.authenticateUser(request, response, next);
});

router.post(`/user/register`, (request: Request, response: Response, next: NextFunction) => {
    userController.ceateUser(request, response, next);
});

export default router;