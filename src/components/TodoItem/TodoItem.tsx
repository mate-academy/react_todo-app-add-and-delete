import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';
type TodoProps = {
  todo: Todo;
  loading?: boolean;
  onDelete: (todoId: number) => void;
};
export const TodoItem: React.FC<TodoProps> = ({ todo, loading, onDelete }) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          id={`todo-${todo.id}`}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          onDelete(todo.id);
        }}
        disabled={loading}
      >
        ×
      </button>

      <TodoLoader isActive={loading} />
    </div>
  );
};
