import cn from 'classnames';
import { Todo } from './types/Todo';
import { TodoLoader } from './TodoLoader';

type Props = {
  todo: Todo;
  clearCompleted: boolean;
  handleCheckboxChange: (todoId: number) => void;
  handleDelete: (todoId: number) => void;
  loading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  clearCompleted,
  handleCheckboxChange,
  handleDelete,
  loading,
}) => {
  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => handleCheckboxChange(todo.id)}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDelete(todo.id)}
          disabled={loading}
        >
          ×
        </button>
        {(loading || (clearCompleted && todo.completed)) && <TodoLoader />}
      </div>
    </>
  );
};
