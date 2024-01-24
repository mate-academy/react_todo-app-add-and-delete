import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo?: (todoId: number) => void;
  selectedId: number;
  isLoadingCompleted?: boolean;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  selectedId,
  isLoadingCompleted,
  isLoading,
}) => {
  const { id, title, completed } = todo;

  const isTodoLoading = (id === selectedId)
    || (isLoadingCompleted && completed)
    || (isLoading);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={deleteTodo ? () => deleteTodo(todo.id) : undefined}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTodoLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
