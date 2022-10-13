import React, { useEffect } from 'react';
import { Error } from '../../../types/Error';

interface Props {
  error: string;
  setError: (error: Error) => void;
}

export const ErrorMessage: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    const timerId = setTimeout(() => setError(Error.None), 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        aria-label="close"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(Error.None)}
      />

      {error}
    </div>
  );
};
