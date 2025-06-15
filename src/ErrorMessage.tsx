import classNames from 'classnames';
import React from 'react';

type Props = {
  error: string;
  onClear: () => void;
};

export const ErrorMessage = ({ error, onClear }: Props) => {
  let errorMessage = '';

  switch (error) {
    case 'empty title':
      errorMessage = 'Title should not be empty';
      break;
    case 'load':
      errorMessage = 'Unable to load todos';
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
      errorMessage = '';
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames({
        notification: true,
        hidden: error === '',
        'is-light': true,
        'has-text-weight-normal': true,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClear}
      />
      {errorMessage}
    </div>
  );
};
