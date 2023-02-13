import classNames from 'classnames';
import React, { useState } from 'react';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onError: (error: string) => void;
  onListChange: React.Dispatch<React.SetStateAction<Todo []>>
  isAdding?: boolean;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onError,
  onListChange,
  isAdding,
}) => {
  const { completed, title, id } = todo;
  const [isLoading, setIsLoading] = useState(false);
  const remove = () => {
    setIsLoading(true);
    deleteTodo(id)
      .then(() => onListChange((state) => state.filter(item => item.id !== id)))
      .catch(() => onError('Cannot delete todo'))
      .finally(() => setIsLoading(false));
  };

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
