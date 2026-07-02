import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type TempTodsProps = {
  tempTodo: Todo;
};

export const TempTods: React.FC<TempTodsProps> = ({ tempTodo }) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: tempTodo.completed,
      })}
    >
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={tempTodo.completed}
        readOnly
      />
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
