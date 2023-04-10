import { useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onTodoDelete?: (todoId: number) => void,
  deletingTodoId?: number | null;
  completedTodoId?: number | null;
};

export const TodoListItem: React.FC<Props> = ({
  todo,
  onTodoDelete = () => true,
  completedTodoId,
}) => {
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const {
    title,
    completed,
    id,
  } = todo;

  const handleTodoDelete = async (todoId: number) => {
    setDeletingTodoId(todoId);
    await onTodoDelete(todoId);
    setDeletingTodoId(null);
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleTodoDelete(todo.id)}
      >
        ×
      </button>

      <div className={classNames(
        'modal',
        'overlay',
        {
          'is-active': id === 0
            || id === deletingTodoId
            || completedTodoId === id,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
