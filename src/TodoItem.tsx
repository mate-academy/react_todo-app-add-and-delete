import React from 'react';
import cn from 'classnames';
import { Todo } from './types/Todo';

interface Props {
  todo: Todo;
  deletingIDs?: number[];
  onDelete?: (id: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  deletingIDs,
}) => {
  const { completed, title, id } = todo;

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
      key={id}
    >
      <label aria-label="Todo-status" className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => {}}
          checked={completed}
        />
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
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': deletingIDs?.includes(id) || id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
