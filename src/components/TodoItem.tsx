import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, updates: Partial<Todo>) => void;
  isLoading: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed },
  onDelete,
  onUpdate,
  isLoading,
}) => {
  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onUpdate(id, { completed: !completed })}
          disabled={isLoading}
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
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="loader delete-loader"></div>
        ) : (
          '×'
        )}
      </button>
    </div>
  );
};
