/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  tempTodo: Todo;
};

export const TempTodo: React.FC<Props> = ({ tempTodo }) => {
  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        {/* This comment is made because it fixes
                "A form label must be associated with a control" error */}
        <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo.title}
      </span>
      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
