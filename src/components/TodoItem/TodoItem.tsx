import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDeleteTodo: (id: number) => Promise<void>;
  loading?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  loading = false,
}) => {
  const { title, id, completed } = todo;
  const [isLoading, setIsLoading] = useState(loading);

  const deleteTodo = useCallback(() => {
    setIsLoading(true);
    onDeleteTodo(id)
      .finally(() => setIsLoading(false));
  }, [onDeleteTodo, id]);

  return (
    <li
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      {id >= 0 ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={deleteTodo}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
