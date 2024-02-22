import React from 'react';
import { useTodos } from '../../Store';

export const TempTodo: React.FC = () => {
  const { tempTodo, handleChangeStatus } = useTodos();

  return (
    <>
      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>

          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              onChange={() => handleChangeStatus(tempTodo.id)}
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
        </div>
      )}
    </>
  );
};
