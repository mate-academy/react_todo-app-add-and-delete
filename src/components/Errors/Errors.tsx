import classNames from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  error: string;
  setError: (newError: string) => void;
};

export const Errors: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    const timer = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(timer);
  }, [error, setError]);

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
        onClick={() => setError('')}
      />
      {error}
    </div>
  );
};
