import React from 'react';
import classNames from 'classnames';

interface NotificationProps {
  errorMessage: string,
  closeErrorMessage: () => void,
}

export const Notification: React.FC<NotificationProps> = ({
  errorMessage,
  closeErrorMessage,
}) => {
  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        aria-label="button"
        type="button"
        className="delete"
        onClick={closeErrorMessage}
      />

      { errorMessage }
    </div>
  );
};
