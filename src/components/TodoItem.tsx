import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deletePost: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, deletePost }) => {
  return (
    <div data-cy="Todo" className="todo completed">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          aria-label={`Mark todo "${todo.title}" as completed`}
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
        onClick={() => deletePost(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
