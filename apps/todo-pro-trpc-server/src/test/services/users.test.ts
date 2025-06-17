import { randomUUID } from 'crypto';
import { DescribeTableCommand } from '@aws-sdk/client-dynamodb';

import { UserRepository } from '../../repositories/userRepo';
import { UsersService } from '../../services/users';
import { getClient, getTableName } from '../../entities/client';

describe('user services', () => {
  const userRepo = new UserRepository();
  const usersService = new UsersService(userRepo);

  it('checks db connection', async () => {
    const tableName = getTableName();

    const command = new DescribeTableCommand({
      TableName: tableName,
    });

    const tables = await getClient().dbClient.send(command);

    expect(tables.Table?.TableName).toBe(tableName);
  });

  it('creates a user', async () => {
    const userEmail = `${randomUUID()}@example.com`;

    const user = await usersService.createUser(userEmail, 'GOOGLE', '123456');

    expect(user).not.toBeNull();
    expect(user.email).toEqual(userEmail);
  });

  it('finds a user', async () => {
    const userEmail = `${randomUUID()}@example.com`;

    await usersService.createUser(userEmail, 'GOOGLE', '123456');

    const user = await usersService.findUserByEmail(userEmail);

    expect(user).not.toBeNull();
    expect(user.email).toEqual(userEmail);
  });

  it('finds or creates a user', async () => {
    const userEmail = `${randomUUID()}@example.com`;

    await usersService.createUser(userEmail, 'GOOGLE', '123456');

    const user = await usersService.findOrCreateUser(userEmail, 'GOOGLE', '123456');

    expect(user).not.toBeNull();
    expect(user.email).toEqual(userEmail);
  });
});
