import React, { useContext, useEffect } from 'react';
import { TodoContext } from '../context/todo.context';

const ErrorNotification: React.FC = () => {
  const { error, setError } = useContext(TodoContext);

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  });

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />
      {error}
    </div>
  );
};

export default ErrorNotification;
