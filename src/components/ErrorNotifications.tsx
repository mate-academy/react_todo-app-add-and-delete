/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../context/todoContext';
import { TodoError } from '../types/TodoError';

export const ErrorNotifications: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodoContext);

  useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() => {
        setErrorMessage(TodoError.empty);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }

    return () => {};
  }, [errorMessage]);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage(TodoError.empty)}
      />
      {errorMessage}
    </div>
  );
};
