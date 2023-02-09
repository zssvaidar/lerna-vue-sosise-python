export default interface UserType {
    id: number;
    username: string;
    email: string;
    password?: string;
    isAdmin: boolean;
    isActive: boolean;

    createdAt?: string;
}
