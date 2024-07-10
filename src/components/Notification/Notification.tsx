import React from 'react';
import classNames from 'classnames';

interface NotificationProps {
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
}

export const Notification: React.FC<NotificationProps> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
