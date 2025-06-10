import { randomUUID } from 'crypto';
import { UserRepository } from '../../repositories/userRepo';
import { UsersService } from '../../services/users';

describe('user services', () => {
  const userRepo = new UserRepository();
  const usersService = new UsersService(userRepo);

  it('tests user creation', async () => {
    const userEmail = `${randomUUID()}@example.com`;

    const user = await usersService.createUser(userEmail, 'GOOGLE', '123456');

    expect(user).not.toBeNull();
    expect(user.email).toEqual(userEmail);
  });

  it('tests user query', async () => {
    const userEmail = `${randomUUID()}@example.com`;

    await usersService.createUser(userEmail, 'GOOGLE', '123456');

    const user = await usersService.findUserByEmail(userEmail);

    expect(user).not.toBeNull();
    expect(user.email).toEqual(userEmail);
  });
});
