import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  processedId: number;
  onDelete?: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  processedId,
  onDelete,
}) => (
  <div data-cy="Todo" className={cn('todo', { completed })}>
    <label className="todo__status-label" aria-label="status-checkbox">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={completed}
        onChange={() => {}}
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {title}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={() => onDelete?.(id)}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', { 'is-active': processedId === id })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
