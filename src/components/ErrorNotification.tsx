import React from 'react';
import { ErrorNotificationProps } from '../types/ErrorNotification';

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(undefined)}
        aria-label="Hide error"
      />
      {errorMessage}
    </div>
  );
};
