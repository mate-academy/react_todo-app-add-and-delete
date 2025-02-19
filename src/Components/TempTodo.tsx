/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  loading: boolean;
  requestMethod: 'GET' | 'POST' | 'UPDATE' | 'DELETE' | null;
  tempTodo: Todo;
};

const TempTodo: React.FC<Props> = ({ loading, requestMethod, tempTodo }) => {
  return (
    <div
      data-cy="Todo"
      className={`todo ${TempTodo.completed && 'completed'} `}
    >
      {/* This is a completed todo */}

      <label className="todo__status-label">
        <input
          name="completed"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={tempTodo.completed}
          // onChange={() => {}}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => todo && handleDelete(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${loading && requestMethod === 'POST' ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TempTodo;
