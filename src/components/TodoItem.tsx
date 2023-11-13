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
  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            handleToggleComplete(todo);
          }}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo)}
        disabled={isLoading}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
