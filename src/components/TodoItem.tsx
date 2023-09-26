import React from 'react';
import { Todo } from '../types/Todo';

type TodoItemProps = {
  todo: Todo;
  handleDeleteTodo: (todo: Todo) => void;
  handleToggleComplete: (todo: Todo) => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  handleDeleteTodo,
  handleToggleComplete,
  isLoading,
}) => {
  const todoClasses = `todo ${todo.completed ? 'completed' : ''}`;
  const loaderClasses = `modal overlay ${isLoading ? 'is-active' : ''}`;

  return (
    <div data-cy="Todo" className={todoClasses} key={todo.id}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleComplete(todo)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        disabled={isLoading}
        onClick={() => handleDeleteTodo(todo)}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className={loaderClasses}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
