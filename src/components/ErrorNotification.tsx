import React from 'react';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  message: ErrorMessage | '';
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ message, onClose }) => {
  const notificationClassName = [
    'notification',
    'is-danger',
    'is-light',
    'has-text-weight-normal',
    message ? '' : 'hidden',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div data-cy="ErrorNotification" className={notificationClassName}>
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
