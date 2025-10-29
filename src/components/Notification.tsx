import React from 'react';
import cn from 'classnames';

type Props = {
  message: string | null;
  onHide: () => void;
};

export const Notification: React.FC<Props> = ({ message, onHide }) => {
  return (
    <div
      data-cy="ErrorNotification"
      role="alert"
      aria-live="polite"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !message },
      )}
    >
      <button
        type="button"
        className="delete"
        data-cy="HideErrorButton"
        onClick={onHide}
        aria-label="Hide error notification"
      />
      {message}
    </div>
  );
};
