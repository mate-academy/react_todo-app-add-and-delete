import React from 'react';
import { Todo } from '../../../types/Todo';

type Props = {
  tempTodo: Todo | null;
};

export const TempTodo: React.FC<Props> = ({ tempTodo }) => {
  if (!tempTodo) {
    return null;
  }

  return (
    <div
      data-cy="Todo"
      className={tempTodo.completed ? 'todo completed' : 'todo'}
      key={tempTodo.id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={tempTodo.completed}
          onChange={() => {}}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {}}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div data-cy="TodoLoader" className="modal overlay is-active">
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
