import React from 'react';
import cn from 'classnames';
import { useNotification } from '../contexts/NotificationContext';

export const ErrorNotification: React.FC = () => {
  const { message, isVisible, hideNotification } = useNotification();

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !isVisible },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideNotification}
        aria-label="Close notification"
      />
      {message}
    </div>
  );
};
