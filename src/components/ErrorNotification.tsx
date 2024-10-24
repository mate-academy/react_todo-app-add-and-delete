import React from 'react';
import classNames from 'classnames';

interface ErrorNotificationProps {
  error: string | null;
  onHideError: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  onHideError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHideError}
      />
      {error}
    </div>
  );
};
