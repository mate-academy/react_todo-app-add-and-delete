import React, { useEffect } from 'react';

import { useError } from './context/ErrorContext';

import cn from 'classnames';

export const ErrorNotification: React.FC = () => {
  const { errorMessage, setErrorMessage } = useError();

  useEffect(() => {
    const delay = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(delay);
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
