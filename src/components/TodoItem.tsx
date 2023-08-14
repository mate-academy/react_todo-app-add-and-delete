import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onDelete?: (id: number) => void,
  loadingTodoIds: number[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  loadingTodoIds,
}) => {
  const { id, title, completed } = todo;

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': loadingTodoIds.length && loadingTodoIds.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
