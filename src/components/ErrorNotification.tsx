import React from 'react';
import { ErrorMessage } from '../types/ErrorMessage';

interface Props {
  message: ErrorMessage | null;
  onClose: () => void;
}

export const ErrorNotification: React.FC<Props> = ({ message, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${message ? '' : 'hidden'}`}
    >
      <button
        className="delete"
        onClick={onClose}
        aria-label="close"
        data-cy="HideErrorButton"
      />
      {message}
    </div>
  );
};
