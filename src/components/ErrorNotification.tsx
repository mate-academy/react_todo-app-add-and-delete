import cn from 'classnames';
import { ErrorMessages } from '../types/ErrorMessages';
import { useEffect } from 'react';

const ERROR_DURATION = 3000;

interface ErrorNotificationProps {
  errorMessage: ErrorMessages | null;
  onHideError: () => void;
}

export const ErrorNotification = ({
  errorMessage,
  onHideError,
}: ErrorNotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onHideError();
    }, ERROR_DURATION);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMessage, onHideError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: errorMessage === null,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHideError}
      />
      {errorMessage}
    </div>
  );
};
