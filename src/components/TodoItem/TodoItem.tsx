import classNames from 'classnames';
import { Todo } from '../../types/Todo';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  deletedTodos: number[];
};

export const TodoItem: React.FC<Props> = ({ todo, onDelete, deletedTodos }) => {
  const { id, completed, title } = todo;

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
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          onDelete(id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': deletedTodos?.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
