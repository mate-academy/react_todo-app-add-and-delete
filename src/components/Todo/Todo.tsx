/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, onDelete, isLoading }) => {
  const [deleting, setDeleting] = useState(false);

  const handleOnDelete = (id: number) => {
    setDeleting(true);
    onDelete(id).finally(() => setDeleting(false));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {isLoading && <Loader isLoading={isLoading} />}

      <Loader isLoading={deleting} />

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleOnDelete(todo.id)}
      >
        ×
      </button>
    </div>
  );
};
