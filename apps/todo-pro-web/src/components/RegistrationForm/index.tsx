import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

import { createClient } from '../../api';
import { useAsync } from '../../hooks/useAsync';
import { setSessionStorage } from '/@/utils';

interface Props {
  display: boolean;
}

function RegistrationForm(props: Props) {
  const trpc = createClient();
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmedPassword, setConfirmedPassword] = useState<string>('');
  const createUserMutation = useMutation(trpc.users.createUser.mutationOptions());

  useAsync(async () => {
    if (createUserMutation.isSuccess) {
      await setSessionStorage('token', createUserMutation.data);
      await router.navigate({ to: '/home' });
    }
  });

  return (
    <div className="flex flex-col p-4" style={props.display ? { display: 'flex' } : { display: 'none' }}>
      {createUserMutation.isError ? (
        <span className="alert alert-error my-4">{createUserMutation.error.message}!</span>
      ) : (
        ''
      )}
      <form>
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="flex items-center">Email:</div>
          <input
            type="email"
            name="email"
            className="input-bordered input"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </div>
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="flex items-center">Password:</div>
          <input
            type="password"
            name="password"
            className="input-bordered input"
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </div>
        <div className="mb-8 grid grid-cols-2 gap-2">
          <div className="flex items-center">Confirm password:</div>
          <input
            type="password"
            name="confirmPassword"
            className="input-bordered input"
            onChange={(e) => setConfirmedPassword(e.currentTarget.value)}
          />
        </div>
        <button
          type="submit"
          className="btn-success btn"
          disabled={createUserMutation.isPending}
          onClick={(e) => {
            e.preventDefault();
            if (email && password && confirmedPassword) {
              createUserMutation.mutate({
                email,
                password,
                confirmedPassword,
              });
            }
          }}
        >
          Sign up
        </button>
      </form>
    </div>
  );
}

export default RegistrationForm;
