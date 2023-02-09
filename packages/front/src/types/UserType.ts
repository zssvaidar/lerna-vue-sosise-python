export default interface UserType {
    id: number;
    username: string;
    email: string;
    password: string;
    isAdmin: string;
    isActive: boolean;

    createdAt?: string;
}

export class UserVueType implements UserType {
  id: number;
  username: string;
  email: string;
  password: string;
  isAdmin: string;
  isActive: boolean;

  constructor (id, username, email, password, isAdmin, isActive) {
    this.id = id
    this.username = username
    this.email = email
    this.password = password
    this.isAdmin = isAdmin
    this.isActive = isActive
  }

  getUsername () {
    return this.username
  }

  getEmail () {
    return this.email
  }

  getPassword () {
    return this.password
  }

  getIsAdmin () {
    return this.isAdmin
  }

  getIsActive () {
    return this.isActive
  }
}
