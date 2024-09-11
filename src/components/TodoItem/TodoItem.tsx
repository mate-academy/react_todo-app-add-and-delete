import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
  onToggleComplete: (todoId: number) => void;
  onDelete: (todoId: number) => Promise<void>;
  isTemp?: boolean;
  isDeleting: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggleComplete,
  onDelete,
  isTemp,
  isDeleting,
}) => {
  const { id, title, completed } = todo;

  const handleCheckboxChange = () => {
    if (isTemp) {
      return;
    }

    onToggleComplete(id);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCheckboxChange}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {!isTemp && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
          disabled={isDeleting}
        >
          ×
        </button>
      )}

      <Loader isTemp={isTemp || isDeleting} />
    </div>
  );
};
