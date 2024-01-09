import React, { useEffect } from 'react';
import cn from 'classnames';
import { useTodos } from '../context/TodoProvider';

export const ErrorNotification: React.FC = () => {
  const { errorMessage, setErrorMessage } = useTodos();

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }, [setErrorMessage, errorMessage]);

  return (
    <div
      /* Notification is shown in case of any error */
      /* Add the 'hidden' class to hide the message smoothly */
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        aria-label="Notification"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
