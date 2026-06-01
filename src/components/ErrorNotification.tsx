import React, { useEffect } from 'react';
import classNames from 'classnames';

interface ErrorNotificationProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message,
  isVisible,
  onHide,
}) => {
  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    const timer = setTimeout(() => {
      onHide();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisible, message, onHide]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !isVisible,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHide}
      />
      {message}
    </div>
  );
};
