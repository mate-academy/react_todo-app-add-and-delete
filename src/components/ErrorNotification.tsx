import React from 'react';
import classNames from 'classnames';
import { useTodos } from '../utils/TodoContext';

export const ErrorNotification: React.FC = () => {
  const { errorMessage, clearError } = useTodos();

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearError}
      />
      {errorMessage}
    </div>
  );
};
