/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';
import classNames from 'classnames';

import './ErrorNotification.scss';
import { TodosContext } from '../TodosContext';

export const ErrorNotification: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage, setErrorMessage]);

  const handleErrorClosing = () => {
    setErrorMessage('');
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames('notification is-danger is-light has-text-weight-normal', {
          hidden: !errorMessage,
        })
      }
    >
      {errorMessage}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleErrorClosing}
      />

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {/* show only one message at a time */}
      {/* Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
    </div>
  );
};
