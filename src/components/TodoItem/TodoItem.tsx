import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  isProcessed: boolean;
  deleteTodo: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  deleteTodo,
}) => {
  const { id, title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      {/* remove */}
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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

      {/* Remove button appears only on hover */}
      <button
        onClick={() => deleteTodo(id)}
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isProcessed })}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
