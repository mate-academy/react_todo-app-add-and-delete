import classNames from 'classnames';
import { Todo } from '../types/Todo';
import React from 'react';

type Props = {
  todo: Todo;
  onChange: (id: number, completed: boolean) => void;
  handleDeleteTodo: (id: number) => Promise<void>;
  loading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onChange,
  handleDeleteTodo,
  loading = false,
}) => {
  const { id, title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={`todo-${id}`} className="todo__status-label">
        <input
          id={`todo-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={event => onChange(id, event.target.checked)}
          disabled={loading}
        />
      </label>

      {/* Заголовок */}
      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Кнопка видалення */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(id)}
        disabled={loading}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
