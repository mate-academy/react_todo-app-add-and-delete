import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  isAdding?: boolean;
  clearCompleted: boolean;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onDelete,
  isAdding,
  clearCompleted,
}) => {
  const { completed, title, id } = todo;

  const [isLoading, setIsLoading] = useState(false);

  const remove = () => {
    setIsLoading(true);
    onDelete(id)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (clearCompleted && completed) {
      remove();
    }
  }, [clearCompleted, completed]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
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

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={remove}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading || isAdding,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
