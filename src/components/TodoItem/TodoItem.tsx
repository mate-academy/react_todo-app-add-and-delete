import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (todoId: number) => void;
  isTemporary?: boolean;
  isDeleting?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed },
  onToggle,
  onDelete,
  isTemporary = false,
  isDeleting = false,
}) => {
  const handleCheckboxChange = () => {
    onToggle(id);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      {/* eslint-disable jsx-a11y/label-has-associated-control */}

      <label className="todo__status-label" htmlFor={`todo-${id}`}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCheckboxChange}
          disabled={isTemporary || isDeleting}
        />
      </label>
      <span className="todo__title" data-cy="TodoTitle">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(id)}
        disabled={isTemporary || isDeleting}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTemporary || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
