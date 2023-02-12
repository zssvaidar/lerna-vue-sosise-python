import { Request, Response, NextFunction } from 'express';
import IOC from 'sosise-core/build/ServiceProviders/IOC';
import HttpResponse from 'sosise-core/build/Types/HttpResponse';
import authConfig from '../../../config/auth';
import UserService from '../../Services/UserService';
import UserAuthUnifier from '../../Types/User/UserAuthUnifier';
import UserRegisterUnifier from '../../Types/User/UserRegisterUnifier';

export default class UserController {

    private userService: UserService;

    constructor() {
        this.userService = IOC.make(UserService) as UserService;
    }

    /**
     * Request to authenticate
     */
    public async authenticateUser(request: Request, response: Response, next: NextFunction): Promise<void>{

        const userUnifier = new UserAuthUnifier(request.body);

        const result = await this.userService.authenticateUser(userUnifier);

        response.cookie('auth-token', result.token, { maxAge : authConfig.tokenExpire,  httpOnly: true, secure: true });

        response.send(result);
    }

    /**
     * Request to create user
     */
    public async ceateUser(request: Request, response: Response, next: NextFunction): Promise<void>{

        const userUnifier = new UserRegisterUnifier(request.body);

        const result = await this.userService.register(userUnifier);

        response.send(result);
    }

    /**
     * Request to authorize user
     */
    public async authorizeToken(request: Request, response: Response, next: NextFunction): Promise<void>{

        const token = request.cookies['auth-token'];

        const user = await this.userService.getUserByJwtwebToken(token);

        response.send({ user, token });
    }
}
