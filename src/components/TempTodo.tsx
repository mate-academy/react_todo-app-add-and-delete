import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  tempTodo: Todo,
};

export const TempTodo: React.FC<Props> = ({ tempTodo }) => {
  return (
    <div
      className={cn('todo', {
        completed: tempTodo.completed,
      })}
    >
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" />
      </label>

      <span className="todo__title">
        {tempTodo.title}
      </span>
      <button type="button" className="todo__remove">x</button>

      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
