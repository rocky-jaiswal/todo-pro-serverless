import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';

const About: React.FC = () => {
  return (
    <div className="flex flex-col items-start min-h-screen">
      <main className="flex flex-col lg:flex-row max-w-7xl min-h-[800px]">
        <div className="flex flex-col p-6">
          <p className="mb-4">
            This site uses cookies to save your user sessions. No data is shared with anyone. All code is open source
            and available for review.
          </p>
          <p className="mb-4">
            All code is on{' '}
            <a
              href="https://github.com/rocky-jaiswal/todo-pro"
              target="_blank"
              rel="noreferrer"
              className={'text-primary underline'}
            >
              Github
            </a>
          </p>
          <p className="mb-4">For any issues / feedback please raise a Github issue.</p>
          <p className="mb-4">
            <Link to={'/'} className="py-4 text-blue-500 underline">
              Back
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};
export const Route = createFileRoute('/about')({
  component: About,
});
