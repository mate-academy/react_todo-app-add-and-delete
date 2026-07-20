import React, { useEffect } from 'react';
import { ErrorMessage } from '../types/ErrorMessage';

interface Props {
  errorMessage: ErrorMessage | null;
  onClose: () => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClose,
}) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${
        !errorMessage ? 'hidden' : ''
      }`}
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
