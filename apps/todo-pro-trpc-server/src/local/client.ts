import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { type AppRouter } from '../routers';

const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc/',
    }),
  ],
});

const hello = () => client.health.greet.query({ name: 'world' });

hello().then(console.log).catch(console.error);
