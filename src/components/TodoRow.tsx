/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import React, { FormEvent, useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  onDelete?: () => Promise<void>;
  onRename?: (title: string) => Promise<void>;
  onToggle?: () => Promise<void>;
  onError?: (message: string) => void;
};

export const TodoRow: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  onRename = () => {},
  onToggle = () => {},
  onError,
}) => {
  const [edited, setEdited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (edited && inputRef.current) {
      inputRef.current.focus();
    }
  }, [edited]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEdited(false);
      setTitle(todo.title);
    }
  };

  const handleRemoveClick = async () => {
    setEdited(false);
    setTitle('');
    setIsLoading(true);
    try {
      await onDelete();
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setIsLoading(true);
      try {
        await onDelete();
      } finally {
        setIsLoading(false);
      }

      setEdited(false);

      return;
    }

    if (trimmedTitle === todo.title) {
      setEdited(false);

      return;
    }

    setIsLoading(true);
    try {
      await onRename(trimmedTitle);
      setEdited(false);
    } catch (error) {
      onError?.('Unable to update a todo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = async () => {
    const trimmedTitle = title.trim();

    // If title is empty, delete
    if (!trimmedTitle) {
      setIsLoading(true);
      try {
        await onDelete?.();
      } finally {
        setIsLoading(false);
      }

      setEdited(false);

      return;
    }

    if (trimmedTitle !== todo.title) {
      setIsLoading(true);
      try {
        await onRename?.(trimmedTitle);
      } finally {
        setIsLoading(false);
      }
    }

    setEdited(false);
  };

  const handleTodoStatusEdit = async () => {
    setEdited(false);
    setIsLoading(true);
    try {
      await onToggle();
    } finally {
      setIsLoading(false);
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
          onChange={() => handleTodoStatusEdit()}
        />
      </label>
      {edited ? (
        <form onSubmit={handleEditSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEdited(true)}
          >
            {todo.title}
          </span>
        </>
      )}

      {!edited && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleRemoveClick}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.id === -1 || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
