/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';

import { useContext, useEffect } from 'react';

import { TodosContext } from '../../context/TodosContext';

export const ErrorNotification = () => {
  const {
    errorMessage,
    setErrorMessage,
  } = useContext(TodosContext);

  const handleCloseError = () => {
    setErrorMessage('');
  };

  function loadError() {
    const errorDelay = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(errorDelay);
  }

  useEffect(() => {
    const cleanup = loadError();

    return cleanup;
  }, [errorMessage]);

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
