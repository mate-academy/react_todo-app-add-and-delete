import classNames from 'classnames';
import { useEffect } from 'react';
import { useTodos } from '../../context/todoProvider';

export const TodoErr = () => {
  const { error, setError } = useTodos();

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: !error,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="hide error button"
        onClick={() => setError(null)}
      />

      {/* show only one message at a time */}
      {error}
      <br />
      {/* Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
    </div>
  );
};
