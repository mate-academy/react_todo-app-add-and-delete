/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef } from 'react';
import { Todo } from '../../types/Todo';
import clsx from 'clsx';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, isLoading, onDelete }) => {
  const isEditing = false;
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={clsx('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value=""
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {}}
        >
          {todo.title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={clsx('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
