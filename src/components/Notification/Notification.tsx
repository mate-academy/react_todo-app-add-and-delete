import React from 'react';
import cn from 'classnames';

interface NotificationProps {
  error: string | null;
  onCloseNotifications: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  error,
  onCloseNotifications,
}) => {
  return (
    <div
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: !error,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={onCloseNotifications}
      />
      {error}
    </div>
  );
};
