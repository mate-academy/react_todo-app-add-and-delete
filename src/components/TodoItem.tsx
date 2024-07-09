import cn from 'classnames';
import { Todo } from '../types/Todo';

// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isLoadingTodo: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoadingTodo,
}) => {
  const { title, completed } = todo;
  const id = uuidv4();

  return (
    <div
      id={id}
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
      key={id}
    >
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
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoadingTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
