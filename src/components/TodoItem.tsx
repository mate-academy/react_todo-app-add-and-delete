import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: () => void;
  isDeleting?: boolean;
  isTemp?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isDeleting,
  isTemp,
}) => {
  const inputId = `todo-${todo.id}`;
  const loaderActive = isTemp || isDeleting;

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */}
      <label className="todo__status-label" htmlFor={inputId}>
        <input
          id={inputId}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': loaderActive })}
        style={{ display: loaderActive ? 'block' : 'none' }}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      {!loaderActive && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={onDelete}
          disabled={isDeleting}
        >
          ×
        </button>
      )}
    </div>
  );
};
