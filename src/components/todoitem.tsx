/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isSaving: boolean;
  isEditing: boolean;
  editingTitle: string;
  onToggle: () => void;
  onRemove: () => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  setEditingTitle: (title: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isSaving,
  isEditing,
  editingTitle,
  onToggle,
  onRemove,
  onStartEdit,
  onSaveEdit,
  setEditingTitle,
}) => {
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEdit();
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={onStartEdit}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isSaving}
          onChange={onToggle}
        />
      </label>

      {!isEditing ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled={isSaving}
            onClick={onRemove}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleEditSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle}
            onChange={handleEditChange}
            onBlur={onSaveEdit}
            autoFocus
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isSaving })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
