/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';

interface TempTodoProps {
  tempTodo: Todo;
}

const TempTodo: React.FC<TempTodoProps> = ({ tempTodo }) => {
  return (
    <div
      key={tempTodo.id}
      data-cy="Todo"
      className={`todo ${tempTodo.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
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
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default TempTodo;
