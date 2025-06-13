import classNames from 'classnames';
import React, { useEffect } from 'react';
import { TodoServiceErrors } from '../types/TodoServiceErrors';

interface PropsErrorNotification {
  message: TodoServiceErrors | null;
  onClose: () => void;
}

export const ErrorNotification: React.FC<PropsErrorNotification> = ({
  message,
  onClose,
}) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [message, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !message },
      )}
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
