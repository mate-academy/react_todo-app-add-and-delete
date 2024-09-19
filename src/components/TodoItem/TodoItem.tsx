import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  deletingTodoId: number | null;
  isLoadingTodo?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  deletingTodoId,
  isLoadingTodo,
}) => {
  const { id, title, completed } = todo;
  const isDeleting = id === deletingTodoId;

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
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
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isDeleting || isLoadingTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
