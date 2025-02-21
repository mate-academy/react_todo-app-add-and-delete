import React from 'react';
import './TodoItem.scss';

import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  loading: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { title, completed },
  loading,
  isSelected,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        'completed': completed,
        'selected': isSelected,
      })}
    >
      <label className="todo__status-label" aria-label="Toggle todo status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={onSelect}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={onDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
