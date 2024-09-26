import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../context/TodoContext';
import { Error } from '../types/ErrorMessage';

export const ErrorComponent: React.FC = () => {
  const { errorMessage, handleSetErrorMessage } = useContext(TodoContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="delete"
        onClick={() => handleSetErrorMessage(Error.none)}
      />
      {errorMessage}
    </div>
  );
};
