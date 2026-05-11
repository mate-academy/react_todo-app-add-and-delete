/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../types/Todo';
import React, { useEffect, useState } from 'react';

type Props = {
  todo: Todo;
  loadingTodoId: number[];
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => Promise<void>;
  onRename: (id: number, title: string) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loadingTodoId,
  onToggle,
  onDelete,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setNewTitle(todo.title);
  }, [todo.title]);

  const handleTitleChange = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    const trimmedTitle = newTitle.trim();

    if (!isEditing) {
      setIsSubmitting(false);

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);
      setIsSubmitting(false);

      return;
    }

    if (!trimmedTitle) {
      await onDelete(todo.id);
      setIsSubmitting(false);

      return;
    }

    const success = await onRename(todo.id, trimmedTitle);

    if (success) {
      setIsEditing(false);
    }

    setIsSubmitting(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={todo.id === 0 || loadingTodoId.includes(todo.id)}
          onChange={() => onToggle(todo.id, !todo.completed)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={async e => {
            e.preventDefault();
            await handleTitleChange();
          }}
        >
          <input
            data-cy="TodoTitleField"
            className="todo__edit"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleTitleChange}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled={loadingTodoId.includes(todo.id) || todo.id === 0}
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${loadingTodoId.includes(todo.id) || todo.id === 0 ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
