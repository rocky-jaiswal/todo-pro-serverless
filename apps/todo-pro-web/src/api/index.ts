import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { QueryClient } from '@tanstack/react-query';

import { type AppRouter } from 'todo-pro-api/dist/src';

// This is dummy api for now
export const api = {
  sessions: {
    createSession: {
      useMutation: () => ({
        mutate: (_x) => {},
        data: {},
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: { message: '' },
      }),
    },
  },
  users: {
    createUser: {
      useMutation: () => ({
        mutate: (_x) => {},
        data: {},
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: { message: '' },
      }),
    },
  },
};

const getHeaders = () => ({});

const trpcClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: import.meta.env.VITE_APP_API_URL, headers: getHeaders() })],
});

export const queryClient = new QueryClient();

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
