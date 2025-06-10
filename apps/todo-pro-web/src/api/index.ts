import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { QueryClient } from '@tanstack/react-query';

import { type AppRouter } from 'todo-pro-api/dist';
import { getSessionStorage } from '../utils';

const getHeaders = () => {
  return {
    'content-type': 'application/json',
    'x-auth-token': getSessionStorage('token') ?? undefined,
  };
};

const trpcClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: import.meta.env.VITE_APP_API_URL, headers: getHeaders() })],
});

export const queryClient = new QueryClient();

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
