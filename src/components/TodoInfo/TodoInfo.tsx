import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  isAdding: boolean
  onDelete: (todoId: number) => void;
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  isAdding,
  onDelete,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  return (
    <div
      key={id}
      data-cy="Todo"
      className={cn(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          { 'is-active': isAdding })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
