/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  handleTodoStatusChange: (id: number) => void;
  handleDeleteTodo: (id: number) => void;
  loadingTodoId: boolean;
  tempTodo: Todo | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  handleTodoStatusChange,
  loadingTodoId,
}) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleTodoStatusChange(todo.id)}
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
        disabled={loadingTodoId}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${loadingTodoId ? `is-active` : ``}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
