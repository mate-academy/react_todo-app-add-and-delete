/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface TodoItemProps {
  todo: Todo;
  isLoading?: boolean;
  handleDelete?: (todoId: Todo['id']) => void;
  onToggle: () => void; // Додаємо onToggle
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading = false,
  handleDelete = () => {},
  onToggle, // Деструктуризуємо onToggle
}) => {
  const { id, title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      // className={`todo ${todo.completed ? 'completed' : ''}`}
      className={classNames('todo', { completed: completed })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={onToggle} // Додаємо обробник зміни
        />
      </label>

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
        className={classNames('modal overlay', { 'is-active': isLoading })} // Додаємо `is-active` тільки коли `isLoading === true`
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
