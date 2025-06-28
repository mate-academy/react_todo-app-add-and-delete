import React from 'react';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  title: string;
  completed: boolean;
  id: number;
  deleteTodo: (id: number) => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  title,
  completed,
  id,
  deleteTodo,
  isLoading,
}) => {
  const handleDelete = (todoId: number) => {
    deleteTodo(todoId);
  };

  return (
    <div data-cy="Todo" className={`todo ${completed && 'completed'}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
