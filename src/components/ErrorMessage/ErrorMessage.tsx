/* eslint-disable max-len */
import classNames from 'classnames';
import { useContext, useEffect } from 'react';
import { TodoContext } from '../../context/TodoContext';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const ErrorMessage: React.FC = () => {
  const { error, setError } = useContext(TodoContext);

  useEffect(() => {
    setTimeout(() => {
      if (error) {
        setError(null);
      }
    }, 3000);
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />
      {error}
    </div>
  );
};
