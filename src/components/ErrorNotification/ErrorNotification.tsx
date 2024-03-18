import cn from 'classnames';
import { useTodos } from '../../context/TodosContext';

export const ErrorNotification: React.FC = () => {
  const { todosError, handleRemoveError } = useTodos();

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !todosError,
      })}
    >
      <button
        aria-label="remove error"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleRemoveError}
      />
      {todosError}
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
