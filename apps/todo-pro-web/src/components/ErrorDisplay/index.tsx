import React from 'react';

interface Props {
  error: unknown;
}

export const ErrorDisplay: React.FC<Props> = (props: Props) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1 className="text-2xl">Oops!</h1>

      <p>Sorry, an unexpected error has occurred.</p>

      <p>
        <i>{props.error as any}</i>
      </p>
    </div>
  );
};
