import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isDeleting: boolean;
  handleDeleteTodo: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isDeleting,
  handleDeleteTodo,
}) => (
  <div
    key={todo.id}
    data-cy="Todo"
    className={`todo ${todo.completed ? 'completed' : ''}`}
  >
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label className="todo__status-label" htmlFor={`status-${todo.id}`}>
      <input
        id={`status-${todo.id}`}
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        readOnly
      />
    </label>
    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>
    {/* Remove button appears only on hover */}
    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={() => handleDeleteTodo(todo.id)}
    >
      ×
    </button>
    {/* overlay will cover the todo while it is being deleted or updated */}
    <div
      data-cy="TodoLoader"
      className={`modal ${isDeleting ? ' is-active overlay' : ''}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
