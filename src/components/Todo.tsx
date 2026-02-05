import React from 'react';
import classNames from 'classnames';

export interface TodoType {
  id: number;
  userId?: number;
  title: string;
  completed: boolean;
}

type Props = {
  todo: TodoType;
  onDelete?: (id: number) => void;
  onToggle?: (id: number, completed: boolean) => void;
  isLoading?: boolean;
};

export const Todo: React.FC<Props> = ({
  todo,
  onDelete,
  onToggle,
  isLoading = false,
}) => {
  const handleCheckboxClick = () => {
    if (onToggle) {
      onToggle(todo.id, !todo.completed);
    }
  };

  return (
    <li
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckboxClick}
          disabled={isLoading}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete && onDelete(todo.id)}
        disabled={isLoading}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
