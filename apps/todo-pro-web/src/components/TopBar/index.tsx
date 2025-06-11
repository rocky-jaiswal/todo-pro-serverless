import { useState } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { useRouter } from '@tanstack/react-router';

export const TopBar = () => {
  // const userDetails = api.users.userDetails.useQuery()

  const router = useRouter();
  const [isLoggedOut, setLoggedOut] = useState(false);

  useAsync(async () => {
    if (isLoggedOut) {
      sessionStorage.clear();
      await router.navigate({ to: '/' });
      router.history.destroy();
    }
  });

  return (
    <div className="flex w-full justify-between navbar">
      <div className="p-4">
        <h1 className="text-3xl font-bold">To-do Pro</h1>
      </div>
      <div className="p-4">
        {/* <div>
          <p className="text-sm font-bold mx-2">Welcome, user</p>
        </div> */}
        <button
          className="btn-secondary btn bg-info"
          onClick={() => {
            setLoggedOut(true);
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
