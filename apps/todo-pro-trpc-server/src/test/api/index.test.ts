import { randomUUID } from 'crypto';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { type AppRouter } from '../../routers';

describe('api', () => {
  const client = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: 'http://server:3000/v2/',
      }),
    ],
  });

  it('works with healthcheck', async () => {
    const hello = () => client.health.ping.query();
    const res = await hello();

    expect(res).not.toBeNull();
  });

  it('creates a user', async () => {
    const email = `${randomUUID()}@example.com`;
    const createUser = () => client.users.createUser.mutate({ email, password: '123456', confirmedPassword: '123456' });
    const res = await createUser();

    expect(res).not.toBeNull();
  });

  it('throws error for a bad create user', async () => {
    const email = `${randomUUID()}@example.com`;
    const createUser = () =>
      client.users.createUser.mutate({ email, password: '1234567', confirmedPassword: '123456' });

    let exception = null;

    try {
      await createUser();
    } catch (err) {
      exception = err;
    }

    expect(exception).not.toBeNull();
  });

  it('creates a session', async () => {
    const email = `${randomUUID()}@example.com`;
    const createUser = () => client.users.createUser.mutate({ email, password: '123456', confirmedPassword: '123456' });
    await createUser();

    const createSession = () => client.sessions.createSession.mutate({ email, password: '123456' });

    const res = await createSession();

    expect(res).not.toBeNull();
  });
});
