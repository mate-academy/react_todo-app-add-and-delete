import React from 'react';
import classNames from 'classnames';

type Props = {
  message: string | null;
  onClose: () => void;
};

export const Notification: React.FC<Props> = ({ onClose, message }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !message },
      )}
    >
      <button
        onClick={onClose}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {message}
    </div>
  );
};
