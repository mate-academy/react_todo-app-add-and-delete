import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo | null;
  loadingTodoIds: number[];
  deleteClickHandler: (
    id: number,
    loaderState: (loaderTodo: boolean) => void
  ) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loadingTodoIds,
  deleteClickHandler,
}) => {
  const [loaderTodo, setLoaderTodo] = useState(false);
  const { id, title, completed } = todo || { id: 0 };

  return (
    <div
      className={classNames(
        'todo',
        { completed },
        { 'todo-temp': id === 0 },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => {
          deleteClickHandler(id, setLoaderTodo);
        }}
      >
        ×
      </button>

      <div className={classNames(
        'modal',
        'overlay',
        {
          'is-active':
          loaderTodo
          || id === 0
          || loadingTodoIds?.includes(id),
        },
      )}
      >
        <div className="
          modal-background
          has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
