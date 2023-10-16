import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  deleteTodo: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, isLoading, deleteTodo }) => {
  const [completedStatus, setCompletedStatus] = useState(todo.completed);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completedStatus })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completedStatus}
          onChange={(e) => {
            setCompletedStatus(e.target.checked);
          }}
        />
      </label>

      {!isEditing ? (
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
            onClick={() => !isLoading && deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            type="text"
            className="todo__title-field"
            value={todo.title}
            onBlur={() => setIsEditing(false)}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
