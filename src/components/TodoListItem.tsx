import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onDeleteTodo: (todoId: number) => void,
  deletingIds: number[],
};

export const TodoListItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  deletingIds,
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
        onClick={() => onDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': deletingIds.includes(todo.id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
