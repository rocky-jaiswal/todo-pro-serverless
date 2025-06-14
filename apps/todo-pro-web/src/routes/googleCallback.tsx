import { useEffect } from 'react';
import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';

import { createClient } from '../api';
import { useAsync } from '../hooks/useAsync';
import { useAuthenticationStore, type AuthState } from '../store';
import { setSessionStorage } from '../utils';

import { Loading } from '../components/Loading';

interface HasCode {
  code?: string;
}

const GoogleCallbackPage = () => {
  const router = useRouter();
  const dispatchForAuthenticationStore = useAuthenticationStore((state: AuthState) => state.dispatch);

  const looseSearch = useSearch({ strict: false }) as HasCode;
  const trpc = createClient();

  const createGoogleUser = useMutation<unknown, any, any>(trpc.users.createGoogleUser.mutationOptions());

  useEffect(() => {
    if (looseSearch.code && !createGoogleUser.isPending) {
      createGoogleUser.mutate({ code: looseSearch.code });
    }
  }, [looseSearch.code]);

  useAsync(async () => {
    if (createGoogleUser.isSuccess) {
      dispatchForAuthenticationStore({ type: 'SIGNIN', payload: createGoogleUser.data as string });
      await setSessionStorage('token', createGoogleUser.data as string);
      await router.navigate({ to: '/home' });
    }
  });

  return (
    <>
      <div className="flex w-full">
        <Loading />
      </div>
    </>
  );
};

export const Route = createFileRoute('/googleCallback')({
  component: GoogleCallbackPage,
});
