import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  isProcessed?: boolean,
  onDelete?: (todoId: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo, isProcessed, onDelete = () => {},
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
          checked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': isProcessed,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
