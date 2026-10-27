/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  onTodoDelete: (todoId: number) => Promise<void>;
  loading?: boolean;
};

export const TodoItem = React.memo(
  ({ todo, onTodoDelete, loading = false }: Props) => {
    const [isCompleted, setIsCompleted] = useState(todo.completed);
    const [isEditing] = useState(false);

    return (
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: isCompleted })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={isCompleted}
            onChange={event => setIsCompleted(event.target.checked)}
          />
        </label>

        {isEditing ? (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>
        ) : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onTodoDelete(todo.id)}
              disabled={loading}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', { 'is-active': loading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
