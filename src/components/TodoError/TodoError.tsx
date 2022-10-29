import classNames from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  error: string | null,
  setError: (error: string | null) => void,
};

export const TodoError: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="delete"
        onClick={() => setError(null)}
      />
      <span>{error}</span>
    </div>
  );
};
