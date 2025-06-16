import cn from 'classnames';
import React, { useEffect } from 'react';
interface ErrorMessagesProps {
  errorMessage: string | null;
  onHideError: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TIMER_DURATION = 3000;

export const ErrorMessages: React.FC<ErrorMessagesProps> = ({
  errorMessage,
  onHideError,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onHideError();
    }, TIMER_DURATION);

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
