import React from 'react';
import classNames from 'classnames';

type Props = {
  error: string,
  closeError: () => void,
};

export const ErrorMessage: React.FC<Props> = ({ error, closeError }) => {
  let errorMessage = '';

  switch (error) {
    case 'load':
      errorMessage = 'Unable to load todos';
      break;

    case 'add':
      errorMessage = 'Unable to add a todo';
      break;

    case 'length':
      errorMessage = 'Title can\'t be empty';
      break;

    case 'delete':
      errorMessage = 'Unable to delete a todo';
      break;

    case 'deleteAll':
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
