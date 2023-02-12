import UserRegisterUnifier from "../Types/User/UserRegisterUnifier";
import UserType from "../Types/User/UserType";

export default interface UserRepositoryInterface {
    /**
     * Get user by email
     */
    getUserByEmail(email: string, withPassword?: boolean): Promise<UserType>;

    /**
     * Get user
     */
    createUser(userUnifier: UserRegisterUnifier, password: string): Promise<number>;

    /**
     * Get users
     */
    getNotAdminUsers(): Promise<UserType[]>;

    /**
     * Delete user by id
     */
    deleteUserByid (userId: number): Promise<void>;

    /**
     * Get user by id
     */
    getUserByid (userId: number): Promise<UserType>;

    /**
     * Update user
     */
    updateUser (data: any): Promise<void>;
}
