/* eslint-disable max-len */
import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

interface TodoProps {
  todo: Todo,
  onDeleteTodo(id: number): void,
  isUpdating: number[],
}

export const TodoItem: React.FC<TodoProps> = ({
  todo, onDeleteTodo, isUpdating,
}) => {
  const {
    id,
    completed,
    title,
  } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [updateTodo, setUpdateTodo] = useState('');

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          aria-label="Enter to do"
          type="checkbox"
          className="todo__status"
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={() => setIsEditing(false)}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={updateTodo}
              onChange={(event) => setUpdateTodo(event.target.value)}
            />
          </form>
        )
        : (
          <span className="todo__title" onDoubleClick={() => setIsEditing(true)}>
            {title}
          </span>
        )}

      {isUpdating.includes(id)
        ? (
          <div className={classNames('modal overlay', {
            'is-active': isUpdating,
          })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )
        : (
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDeleteTodo(id)}
          >
            ×
          </button>
        )}
    </div>
  );
};
