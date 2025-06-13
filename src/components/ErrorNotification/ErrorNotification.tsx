import React, { useEffect } from 'react';
import cn from 'classnames';

type ErrorNotificationProps = {
  message: string;
  onClose: () => void;
};

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message,
  onClose,
}) => {
  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !message,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {message}
    </div>
  );
};
