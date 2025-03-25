import React from 'react';
import cn from 'classnames';

type ErrorNotificationProps = {
  errorMessage: string | null;
  onHide: () => void;
  isVisible: boolean;
};

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMessage,
  onHide,
  isVisible,
}) => {
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
        onClick={onHide}
      />
      {errorMessage}
    </div>
  );
};
