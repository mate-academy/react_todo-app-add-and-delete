import cn from 'classnames';
import { useContext } from 'react';
import { TodoContext } from '../../TodoContext';
import { ErrorsType } from '../../types/ErrorsType';

export const Errors = () => {
  const { errorMessage, setErrorMessage } = useContext(TodoContext);

  let message = '';

  switch (errorMessage) {
    case ErrorsType.Load:
      message = 'Unable to load a todo';
      break;
    case ErrorsType.Add:
      message = 'Unable to add a todo';
      break;
    case ErrorsType.Delete:
      message = 'Unable to delete a todo';
      break;
    case ErrorsType.Update:
      message = 'Unable to update a todo';
      break;
    case ErrorsType.Title:
      message = 'Title can\'t be empty';
      break;
    default:
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: !errorMessage,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {message}
    </div>
  );
};
