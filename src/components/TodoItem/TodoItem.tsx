import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  deleteHandler: ((todoId: number) => Promise<unknown>);
  completedIsRemoving?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo, deleteHandler, completedIsRemoving,
}) => {
  const {
    completed,
    title,
    id,
  } = todo;

  const [isDeleting, setIsDeleting] = useState(false);

  const removeTodo = () => {
    setIsDeleting(true);
    deleteHandler(id).finally(() => setIsDeleting(false));
  };

  useEffect(() => {
    if (completed && completedIsRemoving) {
      removeTodo();
    }
  }, [completedIsRemoving]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => removeTodo()}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': id === 0 || isDeleting },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
