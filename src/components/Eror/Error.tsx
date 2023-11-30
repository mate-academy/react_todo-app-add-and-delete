/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { TodosContext } from '../TodosContext/TodosContext';

export const Error: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);
  const [isErrorHidden, setIsErrorHidden] = useState(true);

  useEffect(() => {
    if (errorMessage !== '') {
      setIsErrorHidden(false);

      const timeoutId = setTimeout(() => {
        setErrorMessage('');
        setIsErrorHidden(true);
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }

    return () => {};
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        { hidden: isErrorHidden },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setErrorMessage('');
          setIsErrorHidden(true);
        }}
      />
      {errorMessage}
    </div>
  );
};
