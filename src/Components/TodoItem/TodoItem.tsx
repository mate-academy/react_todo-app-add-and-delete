import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  onDeleteTodo: (value: number) => Promise<void>;
  isLoading: boolean;
  isBeingDeleted: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  isLoading,
  isBeingDeleted,
  onDeleteTodo,
}) => {
  const handleDelete = () => {
    onDeleteTodo(id);
  };

  const shouldShowLoader = (!id && isLoading) || isBeingDeleted;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label" htmlFor={`input-${id}`}>
        <input
          id={`input-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
        disabled={isBeingDeleted}
      >
        ×
      </button>
      {/* overlay will cover the todo while it is being deleted or updated */}
      {shouldShowLoader && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
