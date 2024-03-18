import React, { useContext } from 'react';
import cn from 'classnames';
import { TodoContext } from '../../context/TodoContext';

export const Error: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodoContext);

  const deleteError = () => {
    setErrorMessage('');
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="deleteErrorButton"
        onClick={deleteError}
      />

      {errorMessage}
    </div>
  );
};
