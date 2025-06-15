import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  toggleTodoStatus: (id: number) => void;
  deleteTodo: (id: number) => void;
  isTemp?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  toggleTodoStatus,
  deleteTodo,
  isTemp = false,
  isDisabled = false,
  isLoading = false,
}) => {
  const isLoaderVisible = isTemp || isLoading;

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed, loading: isTemp })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          aria-label="Toggle todo status"
          checked={todo.completed}
          onChange={() => toggleTodoStatus(todo.id)}
          disabled={isDisabled || isLoading}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
        disabled={isDisabled}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoaderVisible,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
