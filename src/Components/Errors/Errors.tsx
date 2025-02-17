import React from 'react';
import cn from 'classnames';

type Props = {
  error: string;
  onClose: () => void;
};

export const Errors: React.FC<Props> = ({ error, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        'notification is-danger is-light has-text-weight-normal hidden': !error,
      })}
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
