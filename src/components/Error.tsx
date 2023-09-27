import { useContext, useEffect } from 'react';
import cn from 'classnames';
import { TodosContext } from '../context/TodoContext';
import { ErrorType } from '../types/Errors';

export const Error = () => {
  const { handleCloseError, error, setError } = useContext(TodosContext);

  const handleButtonClick = () => {
    handleCloseError();
  };

  useEffect(() => {
    setTimeout(() => {
      setError(ErrorType.None);
    }, 3000);
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        title="errorButton"
        onClick={handleButtonClick}
        aria-label="HideErrorButton"
      />
      {error}
    </div>
  );
};
