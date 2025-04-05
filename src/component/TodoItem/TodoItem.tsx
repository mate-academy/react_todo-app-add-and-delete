import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  handleDeleteTodo: (value: number) => void;
  loading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  loading = false,
}) => {
  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        {}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={`${todo.id}`}
          checked={todo.completed}
          disabled={loading}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
        disabled={loading}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
