import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

import { createClient } from '../../api';
import { useAsync } from '../../hooks/useAsync';
import { setSessionStorage } from '/@/utils';

interface Props {
  display: boolean;
}

function LoginForm(props: Props) {
  const trpc = createClient();
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const createSessionMutation = useMutation<unknown, any, Record<string, string | null>>(
    trpc.sessions.createSession.mutationOptions(),
  );

  useAsync(async () => {
    if (createSessionMutation.isSuccess) {
      await setSessionStorage('token', createSessionMutation.data);
      await router.navigate({ to: '/home' });
    }
  });

  return (
    <div className="flex flex-col p-4" style={props.display ? { display: 'flex' } : { display: 'none' }}>
      {createSessionMutation.isError ? (
        <span className="alert alert-error my-4">{createSessionMutation.error.message}!</span>
      ) : (
        ''
      )}

      <form method="post">
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="flex items-center">Email:</div>
          <input
            type="email"
            name="email"
            required={true}
            className="input-bordered input"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </div>
        <div className="mb-8 grid grid-cols-2 gap-2">
          <div className="flex items-center">Password:</div>
          <input
            type="password"
            name="password"
            required={true}
            className="input-bordered input"
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </div>
        <button
          type="submit"
          className="btn-primary btn"
          disabled={createSessionMutation.isPending}
          onClick={(e) => {
            e.preventDefault();
            if (email && password) {
              createSessionMutation.mutate({
                email,
                password,
              });
            }
          }}
        >
          {createSessionMutation.isPending ? <span className="loading loading-spinner loading-xs" /> : 'Login'}
        </button>
      </form>
      {/* <Link href={'/'} className="py-4 text-blue-500 underline">
        Forgot password?
      </Link> */}
    </div>
  );
}

export default LoginForm;
