import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (todoId: number) => Promise<void>,
  isProcessing: boolean,
  deletedTodos: number[]
};

export const TodoItem: React.FC<Props> = ({
  todo, deleteTodo, isProcessing, deletedTodos,
}) => {
  return (
    <div className={classNames('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(todo.id)}
        disabled={isProcessing}
      >
        ×
      </button>

      <div
        className={classNames('modal overlay', {
          'is-active': deletedTodos.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
