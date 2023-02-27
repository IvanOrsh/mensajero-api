import { User } from '@app/shared';
import { NewUserDto } from '../dtos/new-user.dto';
import { ExistingUserDto } from '../dtos/existing-user.dto';

export interface AuthServiceInterface {
  getUsers(): Promise<User[]>;
  findByEmail(email: string): Promise<User>;
  findById(id: number): Promise<User>;

  hashPassword(password: string): Promise<string>;

  register(newUser: Readonly<NewUserDto>): Promise<User>;

  doesPasswordMatch(password: string, hashPassword: string): Promise<boolean>;
  validateUser(email: string, password: string): Promise<User>;

  login(existingUser: Readonly<ExistingUserDto>): Promise<{
    token: string;
    user: User;
  }>;

  verifyJwt(jwt: string): Promise<{ user: User; exp: number }>;
}
