import { Todo } from '../../Types/Todo';
import '../../styles/todo.scss';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => void;
  isLoading?: boolean;
  onChange?: () => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading = false,
  onChange,
}) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          aria-label={`Статус справи: ${todo.title}`}
          onChange={onChange}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
        disabled={isLoading}
      >
        ×
      </button>

      <Loader isLoading={isLoading} />
    </div>
  );
};
