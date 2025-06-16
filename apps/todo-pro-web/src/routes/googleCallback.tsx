import { useEffect } from 'react';
import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';

import { createClient } from '../api';
import { useAsync } from '../hooks/useAsync';
import { useAuthenticationStore, type AuthActions, type AuthState } from '../store';
import { setSessionStorage } from '../utils';

import { Loading } from '../components/Loading';

interface HasCode {
  code?: string;
}

const GoogleCallbackPage = () => {
  const router = useRouter();
  const looseSearch = useSearch({ strict: false }) as HasCode;
  const dispatchForAuthenticationStore = useAuthenticationStore((state: AuthState & AuthActions) => state.dispatch);

  const trpc = createClient();

  const createGoogleUser = useMutation<unknown, any, any>(trpc.users.createGoogleUser.mutationOptions());

  useEffect(() => {
    if (looseSearch.code && !createGoogleUser.isPending) {
      createGoogleUser.mutate({ code: looseSearch.code });
    }
  }, [looseSearch.code]);

  useAsync(async () => {
    if (createGoogleUser.isSuccess) {
      dispatchForAuthenticationStore({ type: 'SIGNIN' });
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
