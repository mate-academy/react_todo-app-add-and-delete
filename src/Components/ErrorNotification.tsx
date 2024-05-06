import React, { useEffect } from 'react';
import { Error } from '../types/Todo';

interface Props {
  errorType: Error | null;
  error: boolean;
  hideError: () => void;
}
export const ErrorNotification: React.FC<Props> = ({
  errorType,
  error,
  hideError,
}) => {
  let errorMessage = '';

  switch (errorType) {
    case 'load':
      errorMessage = 'Unable to load todos';
      break;
    case 'empty':
      errorMessage = 'Title should not be empty';
      break;
    case 'add':
      errorMessage = 'Unable to add a todo';
      break;
    case 'delete':
      errorMessage = 'Unable to delete a todo';
      break;
    case 'update':
      errorMessage = 'Unable to update a todo';
      break;
    default:
      errorMessage = 'Unknown error';
      break;
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      hideError();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [error, errorType, hideError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideError}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
