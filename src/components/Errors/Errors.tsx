import { useEffect } from 'react';
import { useTodos } from '../../context/TodoProvider';

export const Errors = () => {
  const { errorMessage, setErrorMessage } = useTodos();

  useEffect(() => {
    setTimeout(() => setErrorMessage(''), 3000);
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={errorMessage === ''
        ? 'notification is-danger is-light has-text-weight-normal hidden'
        : 'notification is-danger is-light has-text-weight-normal'}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Hide Error Message"
      />
      {errorMessage}
    </div>
  );
};
