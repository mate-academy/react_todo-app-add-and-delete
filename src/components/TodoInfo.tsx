import React, { useRef, useState, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface TodoProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onRename: (id: number, newTitle: string) => void;
  isLoading?: boolean;
}

export const TodoInfo: React.FC<TodoProps> = ({
  todo,
  onToggle,
  onDelete,
  onRename,
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
  };

  const handleSubmit = async () => {
    const trimmedTitle = editTitle.trim();

    if (!trimmedTitle) {
      try {
        await onDelete();
      } catch (error) {}

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    try {
      await onRename(todo.id, trimmedTitle);
      setIsEditing(false);
    } catch (error) {}
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(todo.title);
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label" aria-label="Toggle todo status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onToggle}
          disabled={isLoading}
        />
      </label>
      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={editTitle}
          onChange={event => setEditTitle(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          ref={inputRef}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDelete}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
