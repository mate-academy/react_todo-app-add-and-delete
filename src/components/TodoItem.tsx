// src/components/TodoItem.tsx
import React, { useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void;
  onUpdate: (todo: Todo) => void;
  isTemp?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
  isTemp = false,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = () => {
    onUpdate({
      ...todo,
      completed: !todo.completed,
    });
  };

  const handleDelete = () => {
    setIsDeleting(true);
    onDelete(todo.id);
  };

  const inputId = `todo-checkbox-${todo.id}`;

  return (
    <div
      className={`todo ${todo.completed ? 'completed' : ''}`}
      data-cy="TodoItem"
    >
      <label
        className="todo__status-label"
        htmlFor={inputId}
      >
        <input
          id={inputId}
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
          data-cy="TodoItemStatus"
        />
      </label>

      <span className="todo__title" data-cy="TodoItemTitle">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleDelete}
        data-cy="TodoDeleteButton"
        disabled={isDeleting}
      >
        ×
      </button>

      {(isDeleting || isTemp) && (
        <div className="todo__loader" data-cy="TodoLoader">
          <span className="loader is-active" />
        </div>
      )}
    </div>
  );
};
