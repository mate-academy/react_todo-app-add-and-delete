import React from 'react';
import cn from 'classnames';

type ErrorNotificationProps = {
  isError: boolean;
  onClose: () => void;
};

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  isError,
  onClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !isError,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      Unable to load todos
    </div>
  );
};
