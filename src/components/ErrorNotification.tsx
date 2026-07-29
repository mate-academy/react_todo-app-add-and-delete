import React from 'react';

type ErrorNotificationProps = {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

export const ErrorNotification = ({
  error,
  setError,
}: ErrorNotificationProps) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={
        !error
          ? 'notification is-danger is-light has-text-weight-normal hidden'
          : 'notification is-danger is-light has-text-weight-normal'
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />

      {error}
    </div>
  );
};
