import classNames from 'classnames';
import { Todo } from '../types/Todo';

type TodoInfoProps = {
  todo: Todo
  onClick?: (todoId: number) => void
  deleteTodoIds?: number[]
};

export const TodoInfo = (
  { todo: { id, completed, title }, onClick, deleteTodoIds }: TodoInfoProps,
) => {
  const todoClassNames = classNames('todo', { completed });
  const modalClassNames = classNames('modal', 'overlay', {
    'is-active': id === 0 || deleteTodoIds?.includes(id),
  });

  return (
    <div data-cy="Todo" className={todoClassNames}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {}}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>

      <button
        data-cy="TodoDelete"
        type="button"
        className="todo__remove"
        onClick={onClick && (() => onClick(id))}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className={modalClassNames}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
