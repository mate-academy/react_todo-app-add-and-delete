/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface TodoProps {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (todo: Todo['id']) => void;
  deletingTodos?: Todo['id'][] | null;
}

export const TodoInfo = React.forwardRef<HTMLDivElement, TodoProps>(
  ({ todo, isLoading = false, onDelete = () => {}, deletingTodos }, ref) => {
    return (
      <div
        data-cy="Todo"
        className={cn('todo', { completed: todo.completed })}
        ref={ref}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => {}}
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
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isLoading || deletingTodos?.includes(todo.id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoInfo.displayName = 'TodoInfo';
