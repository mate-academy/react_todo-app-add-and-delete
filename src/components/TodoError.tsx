import classNames from 'classnames';
import React, { useEffect } from 'react';

interface TodoErrorProp {
  setError: (error: string | null) => void;
  error: string | null;
}

export const TodoError: React.FC<TodoErrorProp> = ({ setError, error }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setError(null);
        }}
      />
      {error}
    </div>
  );
};
