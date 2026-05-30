/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  isEditing: boolean;
  editingValue: string;
  onToggle: (todo: Todo) => void;
  onDelete: (id: Todo['id']) => void;
  onStartEdit: (todo: Todo) => void;
  onEditChange: (value: string) => void;
  onSaveEdit: (todo: Todo) => void;
  onCancelEdit: () => void;
};

export const TodoItem = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      todo,
      isLoading,
      isEditing,
      editingValue,
      onToggle,
      onDelete,
      onStartEdit,
      onEditChange,
      onSaveEdit,
      onCancelEdit,
    },
    ref,
  ) => {
    const editInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (isEditing) {
        editInputRef.current?.focus();
      }
    }, [isEditing]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSaveEdit(todo);
      } else if (e.key === 'Escape') {
        onCancelEdit();
      }
    };

    return (
      <div
        ref={ref}
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => onToggle(todo)}
          />
        </label>

        {isEditing ? (
          <input
            ref={editInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editingValue}
            onChange={e => onEditChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => onSaveEdit(todo)}
          />
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => onStartEdit(todo)}
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
          className={classNames('modal overlay', { 'is-active': isLoading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
