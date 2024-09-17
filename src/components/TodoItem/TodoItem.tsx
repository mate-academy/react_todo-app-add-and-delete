/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, ChangeEvent } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isProcessed: boolean;
  onDelete: () => void;
  onUpdate: (todoId: number, data: Partial<Todo>) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  onDelete,
  onUpdate,
}) => {
  const { id, title, completed } = todo;
  const [textToEdit, setTextToEdit] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (event: ChangeEvent<HTMLInputElement>) => {
    setTextToEdit(event.target.value);
  };

  const handleSave = () => {
    if (textToEdit.trim()) {
      onUpdate(id, { title: textToEdit });
      setIsEditing(false);
    }
  };

  const handleCancel = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTextToEdit(title);
      setIsEditing(false);
    }
  };

  const handleTitleDoubleClick = () => {
    setIsEditing(true);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onUpdate(id, { completed: !completed })}
        />
      </label>
      <span
        data-cy="TodoTitle"
        className={cn('todo__title', { editing: isEditing })}
        onDoubleClick={handleTitleDoubleClick}
      >
        {isEditing ? (
          <input
            className="todo__title-field"
            type="text"
            value={textToEdit}
            onChange={handleEdit}
            onBlur={handleSave}
            onKeyDown={handleCancel}
            autoFocus
          />
        ) : (
          <label>{title}</label>
        )}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={onDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isProcessed })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
