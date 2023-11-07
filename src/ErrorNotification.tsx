import React from 'react';
import { ErrorMessage } from './types/ErrorMessage';

interface ErrorNotificationProps {
  errorMessage: ErrorMessage;
  handleErrorNotificationClick: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMessage,
  handleErrorNotificationClick,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${errorMessage === ErrorMessage.None ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleErrorNotificationClick}
        aria-label="Close error message"
      />
      {errorMessage}
    </div>
  );
};
