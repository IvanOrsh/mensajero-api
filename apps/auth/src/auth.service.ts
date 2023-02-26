import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User } from './user.entity';
import { NewUserDto } from './dtos/new-user.dto';
import { ExistingUserDto } from './dtos/existing-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async getUsers() {
    return await this.usersRepository.find();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password'],
    });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(newUser: Readonly<NewUserDto>): Promise<User> {
    const { firstName, lastName, email, password } = newUser;

    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException(`An account with ${email} already exists!`);
    }

    const hashed = await this.hashPassword(password);

    const savedUser = await this.usersRepository.save({
      firstName,
      lastName,
      email,
      password: hashed,
    });

    delete savedUser.password;

    return savedUser;
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);

    const doesUserExist = !!user;

    if (!doesUserExist) return null;

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!doesPasswordMatch) return null;

    return user;
  }

  async login(existingUser: Readonly<ExistingUserDto>) {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const jwt = await this.jwtService.signAsync({ user });

    return {
      token: jwt,
    };
  }

  async verifyJwt(jwt: string): Promise<{ exp: number }> {
    if (!jwt) {
      throw new UnauthorizedException();
    }

    try {
      const { exp } = await this.jwtService.verifyAsync(jwt);
      return { exp };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
