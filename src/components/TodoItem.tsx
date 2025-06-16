import cn from 'classnames';
import { Todo } from '../types/Todo';
import React from 'react';

type TodoItemProps = {
  todo: Todo;
  onDelete?: (todo: Todo) => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDelete = () => {},
  isLoading = false,
}) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { 'todo completed': todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
          aria-label="Toggle todo status"
        />
      </label>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo)}
        disabled={isLoading}
      >
        ×
      </button>
    </div>
  );
};
