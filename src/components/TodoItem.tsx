/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deletingTodoId: number | null;
  updatingTodoId: number | null;
  onToggle: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
  onRename: (todoId: number, title: string) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deletingTodoId,
  updatingTodoId,
  onToggle,
  onDelete,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleRename = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newTitle = editTitle.trim();

    if (!newTitle) {
      onDelete(todo.id);

      return;
    }

    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    const success = await onRename(todo.id, newTitle);

    if (success) {
      setIsEditing(false);
    }
  };

  const handleBlur = async () => {
    const newTitle = editTitle.trim();

    if (!newTitle) {
      onDelete(todo.id);

      return;
    }

    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    const success = await onRename(todo.id, newTitle);

    if (success) {
      setIsEditing(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  const isLoading = deletingTodoId === todo.id || updatingTodoId === todo.id;

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
          onClick={() => onToggle(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editTitle}
            autoFocus
            onChange={event => setEditTitle(event.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleRename}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

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
