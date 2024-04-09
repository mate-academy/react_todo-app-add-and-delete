import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { useTodosContext } from '../../utils/useTodosContext';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { loadingTodosIds, onTodoDelete } = useTodosContext();
  const { id, title, completed } = todo;
  const isLoading = loadingTodosIds.includes(id);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          aria-label="Todo Status"
          readOnly
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onTodoDelete(id)}
      >
        ×
      </button>

      <Loader isLoading={isLoading} />
    </div>
  );
};
