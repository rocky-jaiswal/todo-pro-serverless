import React, { useState } from 'react';

import { api } from '../../api';
import { useAsync } from '../../hooks/useAsync';

interface Props {
  display: boolean;
}

function RegistrationForm(props: Props) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmedPassword, setConfirmedPassword] = useState<string>('');
  const createUserMutation = api.users.createUser.useMutation();

  useAsync(async () => {
    // if (createUserMutation.isSuccess) {
    //   await router.push('/home');
    // }
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
          disabled={createUserMutation.isLoading}
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
