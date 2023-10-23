/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useState, useRef } from 'react';
import { TodoItemProps } from '../types/TodoItem';

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  handleTodoToggle,
  handleTodoDelete,
  handleTodoUpdate,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableText, setEditableText] = useState<string>(todo.title);
  const inputRef = useRef(null);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      const trimmedText = editableText.trim();

      if (!trimmedText) {
        handleTodoDelete(todo.id);
      } else {
        handleTodoUpdate(todo.id, trimmedText);
      }

      setIsEditing(false);
    } else if (event.key === 'Escape') {
      setEditableText(todo.title);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    const trimmedText = editableText.trim();

    if (!trimmedText) {
      handleTodoDelete(todo.id);
    } else {
      handleTodoUpdate(todo.id, trimmedText);
    }

    setIsEditing(false);
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleTodoToggle(todo.id, !todo.completed)}
        />
      </label>
      {isEditing ? (
        <input
          ref={inputRef}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editableText}
          onChange={(e) => setEditableText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <div
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              setIsEditing(!isEditing);
            }
          }}
        >
          {todo.title}
        </div>
      )}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleTodoDelete(todo.id)}
        >
          ×
        </button>
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
