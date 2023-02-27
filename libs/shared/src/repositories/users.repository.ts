import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BaseAbstractRepository } from './base/base.abstract.repository';
import { UsersRepositoryInterface } from '../interfaces/users.repository.interface';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository
  extends BaseAbstractRepository<User>
  implements UsersRepositoryInterface
{
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }
}
