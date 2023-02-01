import React from 'react';
import cn from 'classnames';
import { TodoLoader } from '../TodoLoader';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isAdding?: boolean;
  isDeleting?: boolean;
  onSetTodoIdForDelete?: (todoId: number) => void;
};

export const TodoInfo: React.FC<Props> = React.memo(
  ({
    todo,
    isAdding,
    isDeleting,
    onSetTodoIdForDelete,
  }) => {
    const {
      id,
      title,
      completed,
    } = todo;

    const handleClickTodoDeleteButton = () => {
      if (onSetTodoIdForDelete) {
        onSetTodoIdForDelete(id);
      }
    };

    return (
      <div
        data-cy="Todo"
        className={cn(
          'todo',
          { completed },
        )}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            defaultChecked={completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={handleClickTodoDeleteButton}
        >
          ×
        </button>

        <TodoLoader isLoading={isAdding || isDeleting} />
      </div>
    );
  },
);
