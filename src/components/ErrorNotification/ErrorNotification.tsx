import React, { useEffect } from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  error: Errors | null;
  setError: (err: Errors | null) => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setError(null);
    }, 3000);

    const clear = (() => clearTimeout(timeOut));

    return clear;
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        aria-label="label"
        className="delete"
        onClick={() => setError(null)}
      />

      {error}
    </div>
  );
};
