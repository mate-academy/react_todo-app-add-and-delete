/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import { Todo } from '../types/Todo';

interface TempTodoItemProps {
  tempTodo: Todo | null;
}

export const TempTodoItem: React.FC<TempTodoItemProps> = ({ tempTodo }) => {
  if (!tempTodo) {
    return null;
  }

  return (
    <div key={0} data-cy="Todo" className="todo">
      <label htmlFor="temp-todo" className="todo__status-label">
        <input
          id="temp-todo"
          type="checkbox"
          className="todo__status"
          checked={tempTodo.completed}
          disabled
        />
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
