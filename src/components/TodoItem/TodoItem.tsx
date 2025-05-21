/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isTodoEditing: boolean;
  selectedPostId: number;
  setIsTodoEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPostId: React.Dispatch<React.SetStateAction<number>>;
  onDelete: (todoId: number) => Promise<void>;
  onUpdate: (todo: Todo) => Promise<void>;
  isProcessing?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isTodoEditing,
  selectedPostId,
  setIsTodoEditing,
  setSelectedPostId,
  onDelete,
  onUpdate,
}) => {
  const { title, id, completed } = todo;
  const [editedTitle, setEditedTitle] = useState(title);
  const [loading, setLoading] = useState(false);

  const isTemp = id === 0;

  const handleTodoDelete = async () => {
    try {
      setLoading(true);
      await onDelete(id);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      setLoading(true);
      await onUpdate({ ...todo, completed: !completed });
    } finally {
      setLoading(false);
    }
  };

  const handleTitleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!editedTitle.trim()) {
        await onDelete(id);
      } else {
        await onUpdate({ ...todo, title: editedTitle });
      }

      setIsTodoEditing(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleStatusChange}
          disabled={loading}
        />
      </label>

      {isTodoEditing && selectedPostId === id ? (
        <form onSubmit={handleTitleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            disabled={loading}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsTodoEditing(true);
              setSelectedPostId(id);
            }}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleTodoDelete}
            disabled={loading}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay disabled', {
          'is-active': loading || isTemp,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
