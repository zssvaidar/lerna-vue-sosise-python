import Database from 'sosise-core/build/Database/Database';
import UserRepositoryInterface from './UserRepositoryInterface';
import { Knex } from 'knex';
import UserType from '../Types/UserType';
import UserRegisterUnifier from '../Types/UserRegisterUnifier';

export default class UserRepository implements UserRepositoryInterface {

    private dbClient: Knex;

    /**
     * Constructor
     */
    constructor() {
        this.dbClient = Database.getConnection(process.env.DB_PROJECT_CONNECTION as string).client;
    }

    /**
     * Get user by email
     */
    public async getUserByEmail(email: string, withPassword: boolean = false): Promise<UserType> {

        const sqlSelect = ['username', 'email', 'is_admin as isAdmin', 'is_active as isActive'];

        if(withPassword) {
            sqlSelect.push('password');
        }

        const result = await this.dbClient.table('user')
            .select(sqlSelect)
            .where('email', email);

        return result[0];
    }

    /**
     * Create user
     */
    public async createUser(userUnifier: UserRegisterUnifier, password: string): Promise<number> {

        try {
            const result = await this.dbClient.table('user')
                .insert({'username': userUnifier.username,  'email': userUnifier.email, 'password': password});

            return result[0];
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Get users
     */
    public async getNotAdminUsers(): Promise<UserType[]> {

        const sqlSelect = ['id', 'username', 'email', 'is_admin as isAdmin', 'is_active as isActive', 'created_at as createdAt'];

        const result = await this.dbClient.table('user')
            .select(sqlSelect)
            .where('is_admin', false);

        return result;
    }

    /**
     * Delete user by id
     */
    public async deleteUserByid (userId: number): Promise<void> {

        const result = await this.dbClient.table('user')
            .delete()
            .where('user.id', userId);

    }

    /**
     * Get user by id
     */
    public async getUserByid (userId: number): Promise<UserType> {

        const result = await this.dbClient.table('user')
            .select('id', 'username', 'email', 'is_admin as isAdmin', 'is_active as isActive', 'created_at as createdAt')
            .where('user.id', userId);

        return result[0];
    }

    /**
     * Update user
     */
    public async updateUser (user: UserType): Promise<void> {
        const result = await this.dbClient.table('user')
            .update({ 'username': user.username, 'email': user.email, 'is_admin': user.isAdmin, 'is_active': user.isActive })
            .where('user.id', user.id);
    }

}
