import React from 'react';
import clasnames from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  tempTodo: Todo;
  loadingTodoId: number | null;
};

export const TempTodo: React.FC<Props> = ({
  tempTodo,
  loadingTodoId,
}) => {
  const {
    title,
    completed,
    id,
  } = tempTodo;

  return (
    <div
      className={clasnames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>
      {/* Remove button appears only on hover */}
      <button type="button" className="todo__remove">×</button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        className={clasnames('modal overlay', {
          'is-active': loadingTodoId === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
