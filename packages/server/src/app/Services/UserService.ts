import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import UserRepositoryInterface from '../Repositories/UserRepositoryInterface';
import UserAuthUnifier from '../Types/User/UserAuthUnifier';
import authConfig from '../../config/auth';
import UserType from '../Types/User/UserType';
import UserRegisterUnifier from '../Types/User/UserRegisterUnifier';

export default class UserService {

    private localStorageRepository: UserRepositoryInterface;

    constructor(localStorageRepository: UserRepositoryInterface) {
        this.localStorageRepository = localStorageRepository;
    }

    private generateJwtwebToken(userUnifier: UserAuthUnifier, secret: string, data: any): string {
        const token = jwt.sign(
            { email: userUnifier.email },
            secret,
            data
        );

        return token;
    }

    private hashPassword(password: string): string {
        const hash = crypto.createHash('sha256').update(password).digest('base64');

        return hash;
    }

    /**
     * Login user
     */
    public async authenticateUser(userUnifier: UserAuthUnifier): Promise<{ user: UserType; token: string; }> {
        const user = await this.localStorageRepository.getUserByEmail(userUnifier.email, true);
        
        if( this.hashPassword(userUnifier.password) === user.password) {
            const token = this.generateJwtwebToken(userUnifier, authConfig.tokenSecret, { expiresIn: authConfig.tokenExpire });
            user.password = undefined;

            return { user, token };
        }

        throw new Error('Invalid credentials');
    }

    public async register (userUnifier: UserRegisterUnifier): Promise<any> {
        const password = this.hashPassword(userUnifier.password);

        const userId = await this.localStorageRepository.createUser(userUnifier, password);

        return { 'id': userId };

    }

    private decodeJwtwebToken (token: string): { email: string } {
        const object = jwt.verify(token, authConfig.tokenSecret);

        return object;
    }

    public async getUserByJwtwebToken (token: string): Promise<UserType> {

        const object = this.decodeJwtwebToken(token);

        const user = await this.localStorageRepository.getUserByEmail(object.email);

        return user;
    }

    public async getNotAdminUsers (): Promise<UserType[]> {

        const users = await this.localStorageRepository.getNotAdminUsers();

        return users;
    }

}