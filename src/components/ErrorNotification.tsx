import React, { useEffect } from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../types/AppError';

type ErrorNotificationProps = {
  error: ErrorMessage;
  onClose: () => void;
};

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  onClose,
}) => {
  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error, onClose]);

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
        onClick={onClose}
      />
      {error}
    </div>
  );
};
