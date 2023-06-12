import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../types/Error';

type NotificationProps = {
  errorMessage: ErrorMessage,
  closeError: () => void,
};

export const Notification: React.FC<NotificationProps> = ({
  errorMessage,
  closeError,
}) => {
  useEffect(() => {
    setTimeout(() => {
      closeError();
    }, 3000);
  }, []);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={closeError}
      >
        ×
      </button>

      {errorMessage}
    </div>
  );
};
