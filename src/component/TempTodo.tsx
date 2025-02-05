import React from 'react';
import { Todo } from '../types/Todo';

interface TempTodoProps {
  tempTodo: Todo;
}

export const TempTodo: React.FC<TempTodoProps> = ({ tempTodo }) => {
  return (
    <div data-cy="Todo" className="todo">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
      </label>{' '}
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
