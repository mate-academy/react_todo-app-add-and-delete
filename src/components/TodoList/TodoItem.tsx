import React from 'react';
import { Todo } from '../../types/Todo';

interface TodoItemProps {
  todo: Todo;
  processingIds: number[];
  handleToggleTodo: (todo: Todo) => void;
  handleRemoveTodo: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  processingIds,
  handleToggleTodo,
  handleRemoveTodo,
}) => {
  const isProcessing = processingIds.includes(todo.id);

  return (
    <div
      data-cy="Todo"
      className={todo.completed ? 'todo completed' : 'todo'}
      key={todo.id}
      style={{ position: 'relative' }}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleTodo(todo)}
          disabled={isProcessing}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleRemoveTodo(todo.id)}
        disabled={isProcessing}
      >
        x
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isProcessing ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
