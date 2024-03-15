import { useContext } from 'react';
import classNames from 'classnames';
import { TodosContext } from './Todos.Context';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const TodoErrors: React.FC = () => {
  const { error, setError } = useContext(TodosContext);

  // {/* DON'T use conditional rendering to hide the notification */}
  // {/* Add the 'hidden' class to hide the message smoothly */}

  return (
    <>
      <div
        data-cy="ErrorNotification"
        // eslint-disable-next-line max-len
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />

        {error}
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
    </>
  );
};
