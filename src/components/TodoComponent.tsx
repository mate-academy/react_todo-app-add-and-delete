import React from 'react';
import { Todo } from '../types/Todo';

interface TodoProps {
  todo: Todo;
}

export const TodoComponent: React.FC<TodoProps> = ({ todo }) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        {''}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={`todo-${todo.id}`}
          checked={todo.completed}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${todo.id === 0 ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
