/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  onUpdate?: (todo: Todo) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete = () => {},
  onUpdate = () => {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSave = () => {
    if (!editTitle.trim()) {
      onDelete(todo.id);
    } else {
      onUpdate({ ...todo, title: editTitle });
    }

    setIsEditing(false);
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() =>
            onUpdate({
              ...todo,
              completed: !todo.completed,
            })
          }
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleSave}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyUp={e => e.key === 'Escape' && setIsEditing(false)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
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
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
