import * as argon2 from 'argon2';
import { TRPCError } from '@trpc/server';

import { Secrets } from './secrets';
import { JWToken } from './token';
import { UserRepository } from '../repositories/userRepo';
import { UsersService } from './users';

export class SessionsService {
  private readonly secrets: Secrets;
  private readonly token: JWToken;
  private readonly userRepo: UserRepository;
  private readonly usersService: UsersService;

  constructor() {
    this.secrets = new Secrets();
    this.token = new JWToken();

    this.userRepo = new UserRepository();
    this.usersService = new UsersService(this.userRepo);
  }

  public async createSession(userId: string) {
    const passphrase = await this.secrets.getSecrets('CERT_SECRET_V2');
    const keyId = await this.secrets.getSecrets('KEY_ID_V2');

    const jwt = this.token.createToken(userId, passphrase!, keyId!);

    return jwt;
  }

  public async validateLogin(email: string, password: string) {
    const user = await this.usersService.findUserByEmail(email);

    if (user) {
      const isValidPassword = await this.validatePassword(user.password ?? '', password);

      if (isValidPassword) {
        const jwt = await this.createSession(user.userId);
        return jwt;
      }
    }

    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'UNAUTHORIZED',
    });
  }

  public async encryptPassword(password: string) {
    const encrypted = await argon2.hash(password);
    return encrypted;
  }

  private async validatePassword(encryptedPassword: string, password: string) {
    const result = await argon2.verify(encryptedPassword, password);
    return result;
  }
}
