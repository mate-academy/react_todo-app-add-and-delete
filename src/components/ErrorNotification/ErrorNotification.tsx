import React from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  error: ErrorMessage;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Hide error message"
        onClick={onClose}
      />
      {error}
    </div>
  );
};
