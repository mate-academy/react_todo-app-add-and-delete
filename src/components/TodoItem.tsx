import { Todo } from '../types/Todo';
import cn from 'classnames';

interface TodoItemProps {
  todo: Todo;
  isActiveModal: boolean;
  handleDeleteTodo: (todoId: number) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed },
  isActiveModal,
  handleDeleteTodo,
}) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label" htmlFor={`TodoStatus-${id}`}>
        <input
          aria-labelledby={`TodoStatus-${id}`}
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
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isActiveModal,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
