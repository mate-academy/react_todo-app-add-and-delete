import React from 'react';

interface ErrorNotificationProps {
  error: string;
  loading: boolean;
  setError: (error: string) => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  loading,
  setError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${
        error ? '' : 'hidden'
      }`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        disabled={loading}
        onClick={() => setError('')}
      />
      {error}
    </div>
  );
};
