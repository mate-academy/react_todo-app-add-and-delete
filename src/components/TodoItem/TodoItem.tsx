import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDeleteTodo: (id: number) => void,
  processedIds: number[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  processedIds,
}) => {
  const { id, completed, title } = todo;

  return (
    <li
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDeleteTodo(id)}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': id === 0 || processedIds.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
