import clsx from 'clsx';
import React from 'react';

type Props = {
  message: string;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ message, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={clsx(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !message.trim(),
        },
      )}
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
