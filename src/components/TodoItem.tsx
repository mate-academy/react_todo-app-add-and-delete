import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  onDelete: (id: number) => void,
  deleteTodoId: number,
}

export const TodoItem: React.FC<Props> = ({
  todo, onDelete, deleteTodoId,
}) => {
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [query, setQuery] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      className={classNames('todo', {
        completed: isCompleted,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={() => {
            setIsCompleted(!isCompleted);
          }}
        />
      </label>

      <span className="todo__title">
        {isEditing ? (
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              onBlur={() => setIsEditing(false)}
            />
          </form>
        ) : (
          <>
            <span
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => {
                onDelete(todo.id);
              }}
            >
              ×
            </button>
          </>
        )}
      </span>

      <div className={`modal overlay ${(!todo.id || deleteTodoId === todo.id) && ('is-active')}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
