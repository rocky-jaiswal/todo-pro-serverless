import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { QueryClient } from '@tanstack/react-query';
import { type AppRouter } from 'todo-pro-api/dist';

import { getSessionStorage } from '../utils';

export const queryClient = new QueryClient();

const getHeaders = () => {
  return {
    'content-type': 'application/json',
    'x-auth-token': getSessionStorage('token') ?? undefined,
  };
};

const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_APP_API_URL,
      headers: getHeaders() as unknown as Record<string, string>,
    }),
  ],
});

const cache = {
  cachedTrpcClient: client,
};

export const createClient = (useCache = true) => {
  let trpcClient = null;

  if (useCache) {
    trpcClient = cache.cachedTrpcClient;
  } else {
    trpcClient = createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: import.meta.env.VITE_APP_API_URL,
          headers: getHeaders() as unknown as Record<string, string>,
        }),
      ],
    });
    cache.cachedTrpcClient = trpcClient;
  }

  return createTRPCOptionsProxy<AppRouter>({
    client: trpcClient,
    queryClient,
  });
};
