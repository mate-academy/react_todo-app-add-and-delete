import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  tempTodo: Todo,
};

export const TempTodoItem: React.FC<Props> = ({ tempTodo }) => {
  const { title } = tempTodo;

  return (
    <>
      <div
        data-cy="Todo"
        className="todo"
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            data-cy="TodoStatus"
            className="todo__status"
          />
        </label>
        <span
          data-cy="TodoTitle"
          className="todo__title"
        >
          {title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
        >
          ×
        </button>

        <div
          className="modal overlay is-active"
          data-cy="TodoLoader"
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
