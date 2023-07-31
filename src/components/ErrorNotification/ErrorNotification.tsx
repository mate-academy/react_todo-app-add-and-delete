/* eslint-disable jsx-a11y/control-has-associated-label */

import { useContext, useEffect } from 'react';

import { TodoContext } from '../../context/TodoContext';

export const ErrorNotification = () => {
  const { errorMessage, setErrorMessage } = useContext(TodoContext);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }, []);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
