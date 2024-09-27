/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { Todo } from "../types/Todo";
import React, { useState } from "react";
import classNames from "classnames";

interface TodoItemProps {
  todo: Todo;
  onDelete?: (id: number) => void;
  onUpdate: (todo: Todo) => void;
  onUpdateTitle: (todo: Todo) => void;
  loading?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loading,
  onDelete,
  onUpdate,
  onUpdateTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleEdit = () => {
    setIsEditing(true);
    setTitle(todo.title);
  };

  const handleSave = () => {
    const newData = { ...todo };

    newData.title = title;
    onUpdateTitle(newData);
    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSave();
    }

    if (event.key === "Escape") {
      setIsEditing(false);
      setTitle(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? "completed" : ""}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate({ ...todo, title })}
          disabled={loading}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={loading}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleEdit}
        >
          {todo.title}
        </span>
      )}

      {onDelete && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
          disabled={loading}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames("modal overlay", {
          "is-active": loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
