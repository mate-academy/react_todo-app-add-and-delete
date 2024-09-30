import React, { useState } from 'react';
import classNames from 'classnames';
import * as action from '../api/todos';

interface Props {
  title: string;
  id: number;
  status?: boolean;
  onError: (error: Error) => void;
  idsToDelete: number[] | null;
  resetIdsToDelete: (todoIds: number[]) => void;
  handleDelete: (val: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  status = false,
  title,
  id,
  onError,
  idsToDelete,
  resetIdsToDelete,
  handleDelete,
}) => {
  const [value, setValue] = useState(title);
  const [deletedTodoId, setDeletedTodoId] = useState(0);

  if (idsToDelete?.length) {
    idsToDelete.forEach(todoId => {
      action
        .deleteTodo(todoId)
        .then(() => {
          handleDelete(todoId);
          resetIdsToDelete(idsToDelete.filter(oldId => oldId !== todoId));
        })
        .catch(onError);
    });
  }

  const deleteTodo: React.MouseEventHandler<HTMLButtonElement> = () => {
    setDeletedTodoId(id);

    action
      .deleteTodo(id)
      .then(() => {
        handleDelete(id);
      })
      .catch(onError)
      .finally(() => setDeletedTodoId(0));
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed: status })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          value={value}
          checked={status}
          onChange={event => setValue(event.target.value)}
          aria-label="Todo input field"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {value}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={deleteTodo}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': deletedTodoId === id || idsToDelete?.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
