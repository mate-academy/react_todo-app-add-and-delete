import classNames from 'classnames';
import { useContext, useEffect } from 'react';
import { TodosContext } from '../context/TodosContext';
import { Errors } from '../types/Errors';

export const TodoErrors = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(Errors.NoErrors);
    }, 3000);
  }, [setErrorMessage, errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Button error message close"
      />
      {errorMessage}
    </div>
  );
};
