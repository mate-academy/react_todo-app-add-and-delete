import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deletePost: (id: number) => void;
  isLoading: boolean;
};

export const TodoComponent: React.FC<Props> = ({
  todo,
  toggleTodo,
  deletePost,
  isLoading,
}) => {
  const { id, title, completed } = todo;

  return (
    <div key={id} data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label" htmlFor={`todo-status-${id}`}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={`todo-status-${id}`}
          checked={completed}
          onChange={() => toggleTodo(id)}
        />
        <span className="visually-hidden">Mark as completed</span>
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deletePost(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
