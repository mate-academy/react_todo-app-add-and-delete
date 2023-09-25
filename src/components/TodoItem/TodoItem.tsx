import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  processingIds: number[],
  onDelete: (id: number) => void,
};

export const TodoItem: React.FC<Props> = (
  { todo, processingIds, onDelete },
) => {
  const { id, completed, title } = todo;
  const [completedStatus, setCompletedStatus] = useState(completed);

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames(
          'todo',
          { completed: completedStatus },
        )}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completedStatus}
            onChange={(event) => {
              setCompletedStatus(event.target.checked);
            }}
          />
        </label>

        <span
          className="todo__title"
          data-cy="TodoTitle"
        >
          {title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames(
            'modal overlay', {
              'is-active': processingIds.includes(todo.id),
            },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
