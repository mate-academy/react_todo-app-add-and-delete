/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import classNames from 'classnames';
import { AppContext } from '../../wrappers/AppProvider';

export const TodoInfo: React.FC = () => {
  const { tempTodo } = useContext(AppContext);

  return (
    <div
      data-cy="Todo"
      className={`todo ${tempTodo.todo?.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={tempTodo.todo?.completed}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo.todo?.title}
      </span>
      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': tempTodo.isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
