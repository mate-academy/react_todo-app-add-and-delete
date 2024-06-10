import React from 'react';

type Props = {
  error: string;
  setError: (error: string) => void;
};

export const Error = ({ error, setError }: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!error && 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      <div>{error}</div>
    </div>
  );
};
