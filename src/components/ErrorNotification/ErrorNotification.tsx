import React, { useEffect } from 'react';
import cn from 'classnames';

type ErrorNotificationProps = {
  errorMessage: string;
  onClose: () => void;
};

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMessage,
  onClose,
}) => {
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(onClose, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage, onClose]);

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
        onClick={onClose}
      />
      {errorMessage}
    </div>
  );
};
