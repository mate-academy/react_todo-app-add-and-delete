import React, { useContext, useEffect } from 'react';
import { TodoContext } from '../context/todo.context';

const ErrorNotification: React.FC = () => {
  const { error, handleError } = useContext(TodoContext);

  useEffect(() => {
    setTimeout(() => {
      handleError(null);
    }, 3000);
  });

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => handleError(null)}
      />
      {error}
    </div>
  );
};

export default ErrorNotification;
