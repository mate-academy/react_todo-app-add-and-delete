import React from 'react';
import cn from 'classnames';
import { TodoLoader } from '../TodoLoader';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isAdding?: boolean;
  isDeleting?: boolean;
  onSetTodoForDelete?: (todo: Todo) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isAdding,
  isDeleting,
  onSetTodoForDelete,
}) => {
  const {
    title,
    completed,
  } = todo;

  const handleClickTodoDeleteButton = () => {
    if (onSetTodoForDelete) {
      onSetTodoForDelete(todo);
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

      {/* <form>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          defaultValue="JS"
        />
      </form> */}

      <TodoLoader isAdding={isAdding} isDeleting={isDeleting} />
    </div>
  );
};
