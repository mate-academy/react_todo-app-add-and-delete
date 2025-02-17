import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  handleToggleTodo: (id: number) => void;
  handleTodoDelete: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { title, completed, id },
  handleToggleTodo = () => {},
  handleTodoDelete = () => {},
}) => {
  return (
    <div data-cy="Todo" className={`todo ${completed && 'completed'}`}>
      {/* eslint-disable jsx-a11y/label-has-associated-control  */}
      <label className="todo__status-label" htmlFor={'' + id}>
        <input
          id={'' + id}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed ? true : false}
          onChange={() => handleToggleTodo(id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleTodoDelete(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
