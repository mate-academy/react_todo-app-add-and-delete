import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onUpdateTodos?: (todo: Todo) => void,
  onDeleteTodo?: (id: number) => void,
  deletedIds?: number[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onUpdateTodos = () => {},
  onDeleteTodo = () => {},
  deletedIds,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          checked={completed}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdateTodos({ ...todo, completed: !completed })}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDeleteTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': id === 0 || deletedIds?.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
