import React from 'react';

interface ErrorNotificationProps {
  message: string | null;
  onClose: () => void;
  isVisible?: boolean;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message,
  onClose,
  isVisible = false,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={
        'notification is-danger is-light has-text-weight-normal' +
        (!isVisible ? ' hidden' : '')
      }
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
