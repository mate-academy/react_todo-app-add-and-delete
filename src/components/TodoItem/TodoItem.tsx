import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeTodo: (todoToDelete: Todo) => Promise<void>,
  isLoading: boolean,
};

export const TodoItem: React.FC<Props> = ({ todo, removeTodo, isLoading }) => {
  const { id, title, completed } = todo;

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => removeTodo(todo)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
