import { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  deletedTodoIds: number | null;
  completedTodoIds: number[] | null;
  deleteTodo: (id: number) => void;
}

export const TodoItem: FC<Props> = (
  {
    todo,
    deletedTodoIds,
    completedTodoIds,
    deleteTodo,
  },
) => {
  const { id, completed, title } = todo;

  return (
    <div
      className={classNames('todo is-loading', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': !id
          || deletedTodoIds === id
          || completedTodoIds?.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
