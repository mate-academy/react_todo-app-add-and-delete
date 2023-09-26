import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  tempTodo: Todo;
};

export const TempTodo: React.FC<Props> = ({
  tempTodo,
}) => {
  const { title } = tempTodo;

  return (
    <div
      data-cy="Todo"
      className="todo"
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          className="todo__status"
        />
      </label>

      {/* This form is shown instead of the title and remove button */}

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {title}
      </span>

      <div
        data-cy="TodoLoader"
        className="modal overlay is-active"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
