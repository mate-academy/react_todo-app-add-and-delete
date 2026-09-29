import React, { useCallback, useEffect } from 'react';
import cn from 'classnames';
import { Errors } from '../../types/Errors';

type Props = {
  errorMessage: Errors;
  onErrorMessage: (errorMessage: Errors) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onErrorMessage,
}) => {
  const handleCloseError = useCallback(() => {
    onErrorMessage(Errors.None);
  }, [onErrorMessage]);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(handleCloseError, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage, handleCloseError]);

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
        onClick={handleCloseError}
      />
      {errorMessage}
    </div>
  );
};
