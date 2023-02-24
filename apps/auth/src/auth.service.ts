import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getUsers() {
    return await this.usersRepository.find();
  }

  async postUser() {
    return await this.usersRepository.save({
      name: 'Larry',
    });
  }
}
