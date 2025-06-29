import React from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegistrationForm';
import LoginRegister from '../components/LoginRegister';
import SocialLogin from '../components/SocialLogin';
import Footer from '../components/Footer';

import { createClient } from '../api';

interface ShowLogin {
  showLogin: boolean;
}

const Root: React.FC = () => {
  const trpc = createClient();
  const [display, setDisplay] = useState<ShowLogin>({ showLogin: true });
  const healthQuery = useQuery(trpc.health.ping.queryOptions());

  if (healthQuery.isSuccess) console.log(healthQuery.data);

  return (
    <div>
      <main className="flex flex-col lg:flex-row max-w-7xl min-h-[800px]">
        <div className="flex flex-col p-8 lg:w-1/2">
          <div className="p-4 text-white">
            <h1 className="text-4xl">Welcome to To-do Pro</h1>
          </div>
          <div className="mt-4 w-full">
            <img src="/todos.svg" alt="illustration" width="800" height="500" />
          </div>
        </div>
        <div className="flex flex-col p-8 lg:w-1/2">
          <LoginRegister display={display} setDisplay={setDisplay} />
          <LoginForm display={display.showLogin} />
          <RegistrationForm display={!display.showLogin} />
          <SocialLogin />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: Root,
});
