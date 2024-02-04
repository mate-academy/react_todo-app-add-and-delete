/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';

import { useContext, useEffect } from 'react';

import { TodosContext } from '../../context/TodosContext';

export const ErrorNotification = () => {
  const {
    errorMessage,
    setErrorMessage,
  } = useContext(TodosContext);

  useEffect(() => {
    const errorDelay = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(errorDelay);
  }, [errorMessage]);

  const handleCloseError = () => {
    setErrorMessage('');
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleCloseError}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
