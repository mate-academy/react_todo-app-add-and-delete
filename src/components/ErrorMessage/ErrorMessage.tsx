import React from 'react';
import { AppError } from '../../types/ApiError';

interface Props {
  removeErrorMessage: () => void;
  errorType: AppError;
}

export const ErrorMessage: React.FC<Props> = ({
  removeErrorMessage,
  errorType,
}) => {
  let message = '';

  switch (errorType) {
    case AppError.Get:
      message = 'Unable to load todos';
      break;
    case AppError.Post:
      message = 'Unable to add todo';
      break;
    case AppError.Patch:
      message = 'Unable to update a todo';
      break;
    case AppError.Delete:
      message = 'Unable to delete a todo';
      break;
    default:
      message = 'Something goes wrong';
  }

  return (
    <div
      className="
        notification
        is-danger
        is-light
        has-text-weight-normal"
    >
      <button
        type="button"
        className="delete"
        aria-label={' '}
        onClick={() => removeErrorMessage()}
      />
      {message}
    </div>
  );
};
