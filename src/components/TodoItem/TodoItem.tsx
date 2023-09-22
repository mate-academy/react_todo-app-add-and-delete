import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  tempTodo: Todo,
};

export const TodoItem: React.FC<Props> = ({ tempTodo }) => {
  return (
    <>
      <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked
          />
        </label>
        <span className="todo__title">
          {tempTodo.title}
        </span>
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
