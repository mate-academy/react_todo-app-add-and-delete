import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface TodoItemProps {
  todo: Todo;
  isLoading?: boolean;
  handleDelete?: (todoId: Todo['id']) => void;
  onToggle: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading = false,
  handleDelete = () => {},
  onToggle,
}) => {
  const { id, title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      key={id}
    >
      <label className="todo__status-label">{/* */}</label>
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={completed}
        onChange={onToggle}
      />
      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
