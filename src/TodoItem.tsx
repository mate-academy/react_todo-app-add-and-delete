import React from 'react';
import { Todo } from './types/Todo';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  isLoading?: boolean;
  loadingTodo: number | null;
  setError?: (error: string | null) => void;
  onDelete: (id: number) => void;
}

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  // setError,
  loadingTodo,
  onDelete,
}) => {
  return (
    <div
      key={todo.id}
      className={`todo ${todo.completed ? 'completed' : ''}`}
      data-cy="Todo"
    >
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isLoading}
          readOnly
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
        disabled={isLoading}
      >
        {loadingTodo === todo.id ? <span className="loader is-small" /> : '×'}
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay ', {
          'is-active': loadingTodo === todo.id || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
