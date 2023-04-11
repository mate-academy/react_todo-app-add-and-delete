import React from 'react';
import classNames from 'classnames';
import { TodoRich } from '../../types/TodoRich';
import { TodoLoadingOverlay } from '../TodoLoadingOverlay';

type Props = {
  todo: TodoRich;
  onTodoDelete?: (todoId: number) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo: {
    id,
    title,
    completed,
    isLoading,
  },
  onTodoDelete,
}) => {
  const hadndleTodoDelete = async () => {
    if (!onTodoDelete) {
      return;
    }

    await onTodoDelete(id);
  };

  return (
    <div
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={hadndleTodoDelete}
      >
        ×
      </button>

      {isLoading && <TodoLoadingOverlay />}
    </div>
  );
};
