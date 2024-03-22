/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../Store/TodoContext';

export const Error: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodoContext);

  const handlerDeleteError = () => {
    setErrorMessage('');
  };

  if (errorMessage.length > 0) {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handlerDeleteError}
      />

      {errorMessage}
    </div>
  );
};
