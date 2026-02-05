/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onToggle: (todoId: number) => Promise<void> | void;
  onDelete: (todoId: number) => Promise<void> | void;
  onRename: (id: number, newTitle: string) => Promise<void> | void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onToggle,
  onDelete,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setTitle(todo.title);
    }
  }, [todo.title, isEditing]);

  const startEditing = () => {
    if (isLoading) {
      return;
    }

    setIsEditing(true);
  };

  const cancelEditing = () => {
    setTitle(todo.title);
    setIsEditing(false);
  };

  const saveEditing = async () => {
    const newTitle = title.trim();

    if (newTitle === todo.title.trim()) {
      setIsEditing(false);

      return;
    }

    if (!newTitle) {
      await onDelete(todo.id);
      setIsEditing(false);

      return;
    }

    await onRename(todo.id, newTitle);
    setIsEditing(false);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = async e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await saveEditing();
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      cancelEditing();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          disabled={isLoading || isEditing}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={async e => {
            e.preventDefault();
            await saveEditing();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={async () => {
              await saveEditing();
            }}
            onKeyDown={onKeyDown}
            disabled={isLoading}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={startEditing}
            title="Double-click to edit"
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
            disabled={isLoading}
            aria-label="Delete todo"
            title="Delete"
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
};

export default TodoItem;
