import React from 'react';
import cn from 'classnames';
import { TypeError } from '../../types/TypeError';

type Props = {
  errorType: TypeError;
};
function getErrorMesseg(error: TypeError) {
  switch (error) {
    case TypeError.TitleEmpty:
      return 'Title should not be empty';
    case TypeError.UnableAddTodo:
      return 'Unable to add a todo';
    case TypeError.UnableDeleteTodo:
      return 'Unable to delete a todo';
    case TypeError.UnableLoadTodos:
      return 'Unable to load todos';
    case TypeError.UnableUpdateTodo:
      return 'Unable to update a todo';
    default:
      return '';
  }
}

export const ErrorNotification: React.FC<Props> = ({ errorType }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: errorType === TypeError.None },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {getErrorMesseg(errorType)}
    </div>
  );
};
