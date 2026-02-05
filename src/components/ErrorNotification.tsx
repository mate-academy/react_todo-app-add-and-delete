import React from 'react';
import classNames from 'classnames';

interface ErrorNotificationProps {
  message: string;
  isHidden: boolean;
  onClose: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message,
  isHidden,
  onClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isHidden },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
        aria-label="Close error notification"
      />
      {message}
    </div>
  );
};
