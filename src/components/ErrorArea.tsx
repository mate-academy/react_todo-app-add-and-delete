/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useContext, useEffect } from 'react';
import { TodoContext } from '../context/TodoContext';

export const ErrorArea: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodoContext);

  useEffect(() => {
    const timerID = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerID);
  }, [errorMessage, setErrorMessage]);

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
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
