import classNames from 'classnames';
import { useContext, useEffect } from 'react';
import { ContextTodo } from '../ContextTodo';
import { ErrorMessage } from '../../types';

export const ErrorNotification = () => {
  const { errorMessage, setErrorMessage } = useContext(ContextTodo);

  useEffect(() => {
    const timerID = setTimeout(() => {
      setErrorMessage(ErrorMessage.NothingEror);
    }, 3000);

    return () => clearTimeout(timerID);
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames('notification is-danger is-light has-text-weight-normal', {
          hidden: !errorMessage,
        })
      }
    >
      <button
        aria-label="delete"
        onClick={() => setErrorMessage(ErrorMessage.NothingEror)}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {errorMessage}
    </div>
  );
};
