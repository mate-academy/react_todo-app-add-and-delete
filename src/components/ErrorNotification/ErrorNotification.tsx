import classNames from 'classnames';
import { useContext, useEffect } from 'react';
// import { ErrorMessage } from '../../types';
import { ContextTodo } from '../ContextTodo';

export const ErrorNotification = () => {
  const { errorMessage, setErrorMessage } = useContext(ContextTodo);

  useEffect(() => {
    const timerID = setTimeout(() => {
      setErrorMessage('');
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
      {/* <button
        onClick={() => setErrorMessage('')}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {errorMessage} */}
    </div>
  );
};
