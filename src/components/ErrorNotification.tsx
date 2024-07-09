import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    if (error) {
      const timerId = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timerId);
    }

    return undefined;
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />
      {error}
      {/*
    Unable to update a todo */}
    </div>
  );
};
