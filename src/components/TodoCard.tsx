import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onDeleteTodo: (todoId: number) => Promise<void>;
  tempTodo: Todo | null;
  isDeleting: boolean;
  setIsDeleting: (isDel: boolean) => void;
};

export const TodoCard: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  tempTodo,
  isDeleting,
  setIsDeleting,
}) => {
  const handleDelete = () => {
    setIsDeleting(true);
    onDeleteTodo(todo.id)
      .catch(() => setIsDeleting(false))
      .finally(() => setIsDeleting(false));
  };

  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
        {/* eslint-disable jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
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
          className={cn('modal', 'overlay', {
            'is-active': tempTodo || (isDeleting && todo),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
