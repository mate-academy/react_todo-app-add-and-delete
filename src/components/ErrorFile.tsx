import React from 'react';
import { Error } from '../types/Todo';

interface Props {
  errorType: Error | null;
  error: boolean;
  errorHide: () => void;
}
export const ErrorFile: React.FC<Props> = ({ errorType, error, errorHide }) => {
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

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
    >
      {errorMessage}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={errorHide}
      />
    </div>
  );
};
