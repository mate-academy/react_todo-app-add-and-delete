import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Errors } from '../types/Errors';

interface Props {
  error: Errors | null,
  setError: (error: Errors | null) => void,
}

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => setError(null), 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >

      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
      >
        <span className="visually-hidden">Hide Error</span>
        <span aria-hidden="true">×</span>
      </button>
      {error}
    </div>
  );
};
