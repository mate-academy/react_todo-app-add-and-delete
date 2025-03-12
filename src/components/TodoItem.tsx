import React from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  handleDeleteTodo: (todoId: number) => void;
  handleToggleTodo: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed, isLoading },
  handleDeleteTodo,
  handleToggleTodo,
}) => {
  const todoId = `todo-${id}`;

  return (
    <div className={`todo ${completed ? 'completed' : ''}`} data-cy="Todo">
      <label className="todo__status-label" htmlFor={todoId}>
        {' '}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={todoId}
          checked={completed}
          onChange={() =>
            handleToggleTodo({
              id,
              title,
              completed,
              isLoading,
              userId: 0,
            })
          }
          disabled={isLoading}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(id)}
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

export default TodoItem;
