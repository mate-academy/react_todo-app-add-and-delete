/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo/Todo';
import cn from 'classnames';

interface Props {
  todo: Todo;
  loading: number[] | null;
  onDelete?: (id: number[]) => void;
  onEdit: (id: number, data: Partial<Todo>) => void;
}

export const TodoUser: React.FC<Props> = ({
  todo,
  loading,
  onDelete = () => {},
  onEdit,
}) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo', 'item-enter-done', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => onEdit(todo.id, { completed: !todo.completed })}
          checked={todo.completed}
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
        onClick={() => onDelete([todo.id])}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loading?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
