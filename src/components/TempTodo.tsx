import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  temporaryTodo: Todo | null;
};

export const TempTodo = ({ temporaryTodo }: Props) => {
  if (temporaryTodo === null) {
    return (
      <div />
    );
  }

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: temporaryTodo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={temporaryTodo.completed}
          readOnly
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {temporaryTodo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
