import classNames from 'classnames';
import { Todo } from './types/Todo';

type TodoItemProps = {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  isDeleting?: boolean;
  isLoading: boolean;
  onDoubleClick: () => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  deleteTodo,
  isDeleting,
  isLoading,
  onDoubleClick,
}) => {
  const showLoader = (todo.id === 0 && isLoading) || (isDeleting && isLoading);

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : 'active'}`}
      key={todo.id}
    >
      <label htmlFor="yourInputId" className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id="yourInputId"
          checked={todo.completed}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={onDoubleClick}
      >
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': showLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
