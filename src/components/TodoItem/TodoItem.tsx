import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

interface TodoProps {
  todo: Todo,
  onDeleteTodo(id: number): void,
  isUpdating: boolean,
}

export const TodoItem: React.FC<TodoProps> = ({
  todo, onDeleteTodo, isUpdating,
}) => {
  const {
    id,
    completed,
    title,
  } = todo;

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          aria-label="Enter to do"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{title}</span>

      {isUpdating
        ? (
          <div className={classNames('modal overlay', {
            'is-active': isUpdating,
          })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )
        : (
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDeleteTodo(id)}
          >
            ×
          </button>
        )}
    </div>
  );
};
