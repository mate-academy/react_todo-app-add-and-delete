import React from 'react';
import { TodosError } from '../../App';
import cn from 'classnames';

interface PropsError {
  onErrorMessage: (value: TodosError) => void;
  error: TodosError;
}

export const ErrorNotif: React.FC<PropsError> = ({ onErrorMessage, error }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: error === null,
      })}
      onClick={() => onErrorMessage(null)}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {error === 'Unable to load todos' && 'Unable to load todos'}
      {error === 'Title should not be empty' && 'Title should not be empty'}
      {error === 'Unable to add a todo' && 'Unable to add a todo'}
      {error === 'Unable to delete a todo' && 'Unable to delete a todo'}
      {error === 'Unable to update a todo' && 'Unable to update a todo'}
    </div>
  );
};
