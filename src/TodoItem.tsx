import classNames from 'classnames';
import React from 'react';
import { Todo } from './types/Todo';

interface Props {
  todo: Todo;
  loading: boolean;
  loadingId: number | number[];
  onDelete: (id: number) => void;
  onCompleted: (todo: Omit<Todo, 'userId'>) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  loadingId,
  onDelete,
  onCompleted,
}) => {
  const { title, id, completed } = todo;

  const handleTodoCompleted = (completedTitle: string, completedId: number) => {
    const updatedTodo =
      completed === false
        ? { title: completedTitle, id: completedId, completed: true }
        : { title: completedTitle, id: completedId, completed: false };

    onCompleted(updatedTodo);
  };

  const isLoading = (currentLoadingId: number) => {
    return (
      loading &&
      (typeof loadingId === 'number'
        ? loadingId === currentLoadingId
        : loadingId.includes(currentLoadingId))
    );
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })} key={id}>
      <label className="todo__status-label" htmlFor={`todo-status-${id}`}>
        <input
          id={`todo-status-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleTodoCompleted(title, id)}
        />
        {/* accessible text for the label */}
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      {/*<form>
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value="Todo is being edited now"
                  />
            </form>*/}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
