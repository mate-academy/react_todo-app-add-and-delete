/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  onToggle: (id: number, completed: boolean) => void;
  onUpdateTitle: (id: number, title: string) => void;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onToggle,
  onUpdateTitle,
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [isSaving, setIsSaving] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleBlur = () => {
    const trimmed = title.trim();

    if (trimmed && trimmed !== todo.title) {
      setIsSaving(true);
      setTitle(trimmed);
      onUpdateTitle(todo.id, trimmed);

      return;
    }

    if (!trimmed) {
      onDelete(todo.id);

      return;
    }

    setIsEditing(false);
    setTitle(todo.title);
  };

  useEffect(() => {
    if (isSaving && title === todo.title) {
      setIsEditing(false);
      setIsSaving(false);
    }
  }, [todo.title, isSaving, title]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setTitle(todo.title);
    }
  };

  let todoClass = 'todo';

  if (todo.completed) {
    todoClass += ' completed';
  }

  if (isEditing) {
    todoClass += ' editing';
  }

  return (
    <div data-cy="Todo" className={todoClass}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, !todo.completed)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleBlur();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay${isLoading ? ' is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
