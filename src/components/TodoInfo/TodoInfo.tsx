import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  onDelete: (id: number) => void
  onUpdate: (id: number, data: Partial<Todo>) => void,
  isLoading: boolean
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  onUpdate,
}) => {
  const { title, completed, id } = todo;

  return (
    <div className={
      classNames(
        'todo',
        { completed },
      )
    }
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdate(id, { completed: !completed })}
        />
      </label>

      <span className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div className={classNames(
        'modal overlay',
        {
          'is-active': isLoading,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
