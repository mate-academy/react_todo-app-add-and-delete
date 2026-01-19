import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader';

type Props = {
  todo: Todo;
  isLoadingTodos: boolean;
  onToggle: (id: number) => void;
  onDeleteTodo: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoadingTodos,
  onToggle,
  onDeleteTodo,
}) => {
  const todoCompleted = todo.completed ? 'completed' : '';

  return (
    <div data-cy="Todo" className={`todo ${todoCompleted}`}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          disabled={isLoadingTodos}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        disabled={isLoadingTodos}
        onClick={() => onDeleteTodo(todo.id)}
      >
        ×
      </button>
      {/* overlay will cover the todo while it is being deleted or updated */}
      <TodoLoader isActive={isLoadingTodos} />
    </div>
  );
};
