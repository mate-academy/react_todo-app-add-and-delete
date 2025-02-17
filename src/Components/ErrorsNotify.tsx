import { useContext, useEffect } from 'react';
import classNames from 'classnames';
import { TodoContext } from './TodoContext';

export const ErrorsNotify = () => {
  const { errorMessage, setErrorMessage } = useContext(TodoContext);
  const showErrorMessage = !!errorMessage;

  const closeErrorMessage = () => {
    setErrorMessage('');
  };

  useEffect(() => {
    setTimeout(() => setErrorMessage(''), 3000);
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !showErrorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeErrorMessage}
      />
      {errorMessage}
    </div>
  );
};
