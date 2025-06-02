import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { trpc } from '../../api';

function SocialLogin() {
  const googleUrlQuery = useQuery(trpc.sessions.getGoogleUrl.queryOptions(undefined, { enabled: false }));

  const handleGoogleSignUp = async () => {
    const url = await googleUrlQuery.refetch();
    // console.log(url.data);
    window.location.replace(url.data as string);
  };

  return (
    <div className="mt-6 flex flex-col p-4 lg:w-1/2">
      <button
        className="btn-info btn"
        onClick={(e) => {
          e.preventDefault();
          void handleGoogleSignUp();
        }}
      >
        Sign in with Google
      </button>
      <div className="h-10" />
    </div>
  );
}

export default SocialLogin;
