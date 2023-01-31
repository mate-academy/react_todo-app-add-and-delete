import { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => Promise<void>;
  isDeletingIds?: number[];
};

export const TodoInfo:FC<Props> = ({
  todo,
  onDelete,
  isDeletingIds = [],
}) => {
  const {
    title,
    completed,
    id,
  } = todo;

  return (
    <li
      data-cy="Todo"
      className={classNames('todo',
        { completed })}
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
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <TodoLoader
        isAdding={todo.id === 0}
        isDeleting={isDeletingIds.includes(todo.id)}
      />

    </li>
  );
};
