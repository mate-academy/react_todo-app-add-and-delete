import cn from 'classnames';
import { memo } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  onDeleteTodo: (id: number) => void,
  loadingTodosIds: number [],
}

export const TodoInfo: React.FC<Props> = memo(({
  todo,
  onDeleteTodo,
  loadingTodosIds,
}) => {
  const { title, completed, id } = todo;

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
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
        value={id}
        onClick={(e) => onDeleteTodo(+e.currentTarget.value)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodosIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
