import React from 'react';
import { Todo } from '../../types';

type Props = {
  todo: Todo,
};

export const TempTodoItem: React.FC<Props> = ({ todo }) => {
  return (
    <div className="todo">
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button type="button" className="todo__remove">×</button>

      {/* 'is-active' class puts this modal on top of the todo */}
      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
