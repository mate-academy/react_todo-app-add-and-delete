import React from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string;
  onClose: () => void;
};

export const Notification: React.FC<Props> = ({ errorMessage, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {errorMessage}
    </div>
  );
};
