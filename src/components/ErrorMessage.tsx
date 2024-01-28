import classNames from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  error: string,
  setError: (er: string) => void,
};

export const ErrorMessage: React.FC<Props> = ({
  error,
  setError,
}) => {
  useEffect(() => {
    setTimeout(() => setError(''), 3000);
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
        aria-label="hideError"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {error}
    </div>
  );
};
