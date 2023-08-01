import React, { useContext, useEffect } from 'react';
import cn from 'classnames';
import { TodosContext } from '../context/todosContext';
import { wait } from '../utils/fetchClient';

export const NotificationBlock: React.FC = () => {
  const {
    errorMessage,
    setErrorMessage,
  } = useContext(TodosContext);

  function resetError() {
    wait(3000).then(() => setErrorMessage(''));
  }

  useEffect(() => {
    if (errorMessage) {
      resetError();
    }
  }, [errorMessage]);

  return (
    <div
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
        aria-label="Close error notification"
      />
      {errorMessage}
    </div>
  );
};
