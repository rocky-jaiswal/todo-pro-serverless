import { createFileRoute } from '@tanstack/react-router';

const Logout = () => {
  return (
    <>
      <main className="flex">
        <h2>Logging out ...</h2>
      </main>
    </>
  );
};

export const Route = createFileRoute('/logout')({
  component: Logout,
});
