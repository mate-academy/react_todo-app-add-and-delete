/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  tempToDo: Todo | null;
};

export const TempToDo: React.FC<Props> = ({ tempToDo }) => {
  if (!tempToDo) {
    return null;
  }

  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label" htmlFor={`tempToDo-${tempToDo.id}`}>
        <input
          id={`tempToDo-${tempToDo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={tempToDo.completed}
          disabled
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {tempToDo.title}
      </span>

      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
