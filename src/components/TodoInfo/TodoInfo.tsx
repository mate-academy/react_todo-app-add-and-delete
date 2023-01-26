import React, { memo, useState } from 'react';
import cn from 'classnames';
import { TodoLoader } from '../TodoLoader';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete:(todoId: number) => Promise<void>;
  temporary?: boolean
};

export const TodoInfo: React.FC<Props> = memo(({
  todo,
  onDelete,
  temporary = false,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTodo = async () => {
    setIsDeleting(true);

    await onDelete(id);

    setIsDeleting(false);
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
        onClick={handleDeleteTodo}
      >
        ×
      </button>

      <TodoLoader isLoading={isDeleting || temporary} />
    </div>
  );
});
