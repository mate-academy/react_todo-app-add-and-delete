import cn from 'classnames';
import { useEffect } from 'react';

interface ErrorNotificationProps {
  errorMessage: string | null;
  onHideError: () => void;
}

export const ErrorNotification = ({
  errorMessage,
  onHideError,
}: ErrorNotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onHideError();
    }, 3000);

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
