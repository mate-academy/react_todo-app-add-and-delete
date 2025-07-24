import React from 'react';

interface NotificationProps {
  error: string;
  onHide: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  error,
  onHide,
}) => (
  <div
    data-cy="ErrorNotification"
    className={
      'notification is-danger is-light has-text-weight-normal' +
      (error ? '' : ' hidden')
    }
    aria-live="polite"
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onHide}
      aria-label="Hide notification"
    />
    {error}
  </div>
);
