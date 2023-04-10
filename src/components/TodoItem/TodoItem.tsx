import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoadingOverlay } from '../TodoLoadingOverlay';

type Props = {
  todo: Todo;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
}) => {
  return (
    <div
      className={classNames(
        'todo',
        {
          completed: todo.completed,
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

      <span className="todo__title">{todo.title}</span>

      <button type="button" className="todo__remove">×</button>

      {isLoading && <TodoLoadingOverlay />}
    </div>
  );
};
