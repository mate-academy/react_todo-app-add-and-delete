/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (userId: number) => void;
  loading: number[];
};

export const TodoInfo: React.FC<Props> = ({
  todo: { id, title, completed },
  deleteTodo,
  loading: loading,
}) => {
  const handleDelete = () => {
    if (id !== undefined) {
      deleteTodo(id);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
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
        onClick={handleDelete}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loading.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
