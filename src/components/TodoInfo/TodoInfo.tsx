import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeTodo: (todoId: number) => void,
  deletedTodoId: number[],
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  removeTodo,
  deletedTodoId,
}) => {
  const {
    completed,
    title,
    id,
  } = todo;

  return (
    <div
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => removeTodo(id)}
      >
        ×
      </button>

      <div className={cn('modal', 'overlay', {
        'is-active': todo.id === 0 || deletedTodoId.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
