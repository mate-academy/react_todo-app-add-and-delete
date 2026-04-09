// components/ErrorNotification.tsx
import React from 'react';
import classNames from 'classnames';

type ErrorNotificationProps = {
  error: string | null;
  onClose: () => void;
};

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  onClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {error}
    </div>
  );
};
