/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import cn from 'classnames';
import { TodosContext } from '../context/TodosContext';
import { ErrorType } from '../types/ErrorType';

export const Error: React.FC = () => {
  const { error, setError } = useContext(TodosContext);

  let errorToDisplay: string;

  switch (error) {
    case ErrorType.Loading:
      errorToDisplay = 'Unable to load todos';
      break;
    case ErrorType.EmptyTitle:
      errorToDisplay = 'Title should not be empty';
      break;
    case ErrorType.Add:
      errorToDisplay = 'Unable to add a todo';
      break;
    case ErrorType.Delete:
      errorToDisplay = 'Unable to delete a todo';
      break;
    case ErrorType.Update:
      errorToDisplay = 'Unable to update a todo';
      break;
    default:
      errorToDisplay = '';
  }

  return (
    // {/* Notification is shown in case of any error */}
    // {/* Add the 'hidden' class to hide the message smoothly */}
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: error === ErrorType.Success },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(ErrorType.Success)}
      />
      {/* show only one message at a time */}

      {errorToDisplay}
    </div>
  );
};
