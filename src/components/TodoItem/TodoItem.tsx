import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (todoId: number) => void,
  isLoading: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  isLoading,
}) => {
  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          // checked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
