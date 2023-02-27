import { BaseInterfaceRepository } from '../repositories/base/base.interface.repository';

import { User } from '../entities/user.entity';

// eslint-disable-next-line
export interface UsersRepositoryInterface
  extends BaseInterfaceRepository<User> {}
