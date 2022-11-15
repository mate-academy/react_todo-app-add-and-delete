import React from 'react';
import classNames from 'classnames';
import { ErrorTypes } from '../types/ErrorType';

type Props = {
  error: ErrorTypes,
  closeError: () => void,
};

export const ErrorMessage: React.FC<Props> = ({ error, closeError }) => {
  let errorMessage = '';

  switch (error) {
    case ErrorTypes.LOAD:
      errorMessage = 'Unable to load todos';
      break;

    case ErrorTypes.ADD:
      errorMessage = 'Unable to add a todo';
      break;

    case ErrorTypes.LENGTH:
      errorMessage = 'Title can\'t be empty';
      break;

    case ErrorTypes.DELETE:
      errorMessage = 'Unable to delete a todo';
      break;

    case ErrorTypes.DELETEALL:
      errorMessage = 'Unable to delete todos';
      break;

    default:
      break;
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
        { hiden: error },
      )}
    >
      <button
        aria-label="HideErrorButton"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeError}
      />
      {errorMessage}
    </div>
  );
};
