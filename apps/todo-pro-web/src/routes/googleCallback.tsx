import { useEffect } from 'react';
import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';

import { trpc } from '../api';
import { useAsync } from '../hooks/useAsync';
import { setSessionStorage } from '../utils';

interface HasCode {
  code?: string;
}

const GoogleCallbackPage = () => {
  const router = useRouter();
  const looseSearch = useSearch({ strict: false }) as HasCode;

  const createGoogleUser = useMutation(trpc.users.createGoogleUser.mutationOptions());

  useEffect(() => {
    if (looseSearch.code && !createGoogleUser.isPending) {
      createGoogleUser.mutate({ code: looseSearch.code });
    }
  }, [looseSearch.code]);

  useAsync(async () => {
    if (createGoogleUser.isSuccess) {
      setSessionStorage('token', createGoogleUser.data);
      await router.navigate({ to: '/home' });
    }
  });

  return (
    <>
      <div className="flex w-full">
        <p>Loading user...</p>
      </div>
    </>
  );
};

export const Route = createFileRoute('/googleCallback')({
  component: GoogleCallbackPage,
});
