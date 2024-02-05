/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';
import classNames from 'classnames';
import { TodoContext } from './TodosContext';

export const ErrorComponent: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodoContext);

  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(errorTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

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
