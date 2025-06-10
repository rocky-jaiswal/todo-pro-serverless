import { v5 } from 'uuid';
import { formatISO } from 'date-fns';

import { UserRepository } from '../repositories/userRepo';

const UUID_NAMESPACE = 'c0d89385-5ab1-4250-8c8a-bccb3cb693c4';

export class UsersService {
  private readonly userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  public async findOrCreateUser(email: string, loginType: string, password?: string) {
    const deterministicUserId = this.getIdFromEmail(email);

    const user = await this.findUserById(deterministicUserId);

    if (!user) {
      const newUser = await this.createUser(email, loginType, password);
      return newUser;
    }

    return user;
  }

  public async createUser(email: string, loginType: string, password?: string) {
    const user = await this.userRepo.createUser(
      this.getIdFromEmail(email),
      email,
      loginType,
      formatISO(new Date()),
      password,
    );

    return user;
  }

  public async findUserByEmail(email: string) {
    const deterministicUserId = this.getIdFromEmail(email);

    const user = await this.findUserById(deterministicUserId);

    return user;
  }

  public async findUserById(userId: string) {
    const users = await this.userRepo.findUserById(userId);

    return users[0];
  }

  private getIdFromEmail(email: string) {
    return v5(email, UUID_NAMESPACE);
  }
}
