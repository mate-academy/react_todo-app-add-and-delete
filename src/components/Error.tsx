import React, { useEffect } from 'react';

type Props = {
  error: string,
  setError: (error: string) => void,
};

export const Error: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    setTimeout(() => setError(''), 3000);
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="delete"
        onClick={() => setError('')}
      />

      {error}
    </div>
  );
};
