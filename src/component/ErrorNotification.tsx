import classNames from 'classnames';
import React from 'react';
import { useTodos } from '../utils/TodoContext';
import { Errors } from '../types/ErrorsTodo';

export const ErrorNotification: React.FC = () => {
  const { errorMessage, setErrorMessage } = useTodos();

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: errorMessage === Errors.NoErrors },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(Errors.NoErrors)}
      />
      {errorMessage}
    </div>
  );
};
