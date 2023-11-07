/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';
import cn from 'classnames';
import { TodosContext } from '../TodosContext';

export const Error: React.FC = () => {
  const {
    errorMessage,
    setErrorMessage,
  } = useContext(TodosContext);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (errorMessage) {
      timeoutId = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [errorMessage]);

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
        onClick={() => {
          setErrorMessage('');
        }}
      />
      {errorMessage}
    </div>
  );
};
