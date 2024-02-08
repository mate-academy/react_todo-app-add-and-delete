/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { TodoContext } from './TodoContex';

const TodoError: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodoContext);
  const [isErrorHidden, setIsErrorHidden] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    if (errorMessage !== '') {
      setIsErrorHidden(false);

      timeoutId = setTimeout(() => {
        setErrorMessage('');
        setIsErrorHidden(true);
      }, 2000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [errorMessage, setErrorMessage]);

  const clearButton = () => {
    setErrorMessage('');
    setIsErrorHidden(true);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isErrorHidden },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearButton}
      />
      {errorMessage}
    </div>
  );
};

export default TodoError;
