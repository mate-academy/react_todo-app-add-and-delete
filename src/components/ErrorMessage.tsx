/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect } from 'react';
import { useTodoContext } from '../context/TodoContext';

export const ErrorMessage: React.FC = () => {
  const { error, setError } = useTodoContext();

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }, []);

  return (
    <div
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />

      {error}
    </div>
  );
};
