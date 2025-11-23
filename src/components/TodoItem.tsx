import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onUpdate: (id: number, title: string) => void;
  isTemp?: boolean;
  isDeleting: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  onToggle,
  isTemp = false,
  isDeleting,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label="Toggle todo"
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      {!isTemp && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled={isLoading}
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isTemp || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
