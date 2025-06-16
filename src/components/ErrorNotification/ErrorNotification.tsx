import classNames from 'classnames';
import React, { useEffect } from 'react';
import { ErrorNotificationMessage } from '../../types/ErrorNotificationMessage';

interface ErrorNotificationProps {
  errorMessage: string;
  onErrorMessage: (errorMessage: ErrorNotificationMessage) => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMessage,
  onErrorMessage,
}) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(
      () => onErrorMessage(ErrorNotificationMessage.Cleared),
      3000,
    );

    return () => clearTimeout(timer);
  }, [errorMessage, onErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorMessage(ErrorNotificationMessage.Cleared)}
      />
      {errorMessage}
    </div>
  );
};
