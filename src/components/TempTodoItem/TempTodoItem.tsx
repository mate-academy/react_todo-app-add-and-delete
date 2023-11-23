import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  tempItem: Todo;
};

export const TempTodoItem: React.FC<Props> = ({ tempItem }) => {
  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={false}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {tempItem.title}
      </span>

      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
