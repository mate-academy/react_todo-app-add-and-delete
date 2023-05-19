import { memo } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (todoToDeleteId: number) => void;
  loadingTodoIds: number[];
};

export const TodoItem: React.FC<Props> = memo(({
  todo,
  onDelete = () => {},
  loadingTodoIds,
}) => {
  const { title, completed } = todo;
  const isLoading = loadingTodoIds.includes(todo.id);

  return (
    <div className={cn('todo', {
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
        onClick={() => onDelete(todo.id)}
        disabled={isLoading}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
