import React, { useContext, useEffect } from 'react';
import cn from 'classnames';
import { AppContext } from '../../ContextProvider/AppContext';

export const Error: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(AppContext);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (errorMessage) {
      timerId = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }

    return () => clearTimeout(timerId);
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >

      <button
        aria-label="Hide Notification"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
