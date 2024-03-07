import React, { useEffect } from 'react';
import cn from 'classnames';

type ErrorProps = {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

export const Error: React.FC<ErrorProps> = ({ error, setError }) => {
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return () => {};
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
        aria-label="Close notification"
      />
      {/* show only one message at a time */}
      {error}
    </div>
  );
};
