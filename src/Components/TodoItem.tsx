/* eslint-disable import/extensions */
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onloadingTodoIds?: number[];
  handleToggleTodo: (id: number) => void;
  handleTodoDelete?: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { title, completed, id },
  onloadingTodoIds = [],
  handleToggleTodo = () => {},
  handleTodoDelete = () => {},
}) => {
  const isActiveTodoIds = onloadingTodoIds.includes(id) || id === 0;

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleToggleTodo(id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleTodoDelete(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isActiveTodoIds,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
