import React, { useState, useEffect } from 'react';
import { Todo as TodoType } from '../types/Todo';
import cn from 'classnames';

/* eslint-disable jsx-a11y/label-has-associated-control */

type Props = {
  todo: TodoType;
  loadingTodoIds?: Set<number>;
  bulkOperationInProgress?: boolean;
  onUpdate?: (id: number, updates: Partial<TodoType>) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
};

export const Todo: React.FC<Props> = ({
  todo,
  loadingTodoIds,
  bulkOperationInProgress,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const [showLoading, setShowLoading] = useState(false);

  // Коли loadingTodoIds змінюється, оновлюємо стан showLoading
  useEffect(() => {
    if (loadingTodoIds?.has(todo.id) || bulkOperationInProgress) {
      // Show loader immediately for all todos
      setShowLoading(true);
    } else {
      // Hide loader when loading is complete
      setShowLoading(false);
    }
  }, [loadingTodoIds, bulkOperationInProgress, todo.id]);

  const handleToggleCompleted = () => {
    onUpdate?.(todo.id, { completed: !todo.completed });
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(todo.title);
  };

  const handleSaveEdit = () => {
    const trimmedValue = editValue.trim();

    if (trimmedValue === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedValue) {
      onDelete?.(todo.id)
        ?.then(() => {
          setIsEditing(false);
        })
        .catch(() => {});

      return;
    }

    onUpdate?.(todo.id, { title: trimmedValue })
      ?.then(() => {
        setIsEditing(false);
      })
      .catch(() => {});
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(todo.title);
    }
  };

  const handleDelete = () => {
    onDelete?.(todo.id);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleCompleted}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSaveEdit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSaveEdit}
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

      {/* Remove button appears only on hover */}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': showLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
