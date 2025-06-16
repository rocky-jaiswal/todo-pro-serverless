import { useState } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { useRouter } from '@tanstack/react-router';
import { useAuthenticationStore, type AuthActions, type AuthState } from '/@/store';

export const TopBar = () => {
  const router = useRouter();
  const [isLoggedOut, setLoggedOut] = useState(false);
  const dispatchForAuthenticationStore = useAuthenticationStore((state: AuthState & AuthActions) => state.dispatch);

  useAsync(async () => {
    if (isLoggedOut) {
      dispatchForAuthenticationStore({ type: 'SIGNOUT' });
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
