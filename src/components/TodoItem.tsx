import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';
import { EditingForm } from './EditingForm';

type Props = {
  todo: Todo
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { title, completed } = todo;
  const [isEditing] = useState(false);
  const [isLoading] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        [TodoStatus.Editing]: isEditing,
        [TodoStatus.Completed]: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      {isEditing
        ? <EditingForm />
        : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
            >
              ×
            </button>

          </>
        )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
