import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onRemove: (userId: number) => void;
  todosTransform: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemove,
  todosTransform,
}) => {
  const { completed, title, id } = todo;
  const handlerRemove = () => onRemove(id);

  return (
    <div
      className={classNames('todo', {
        completed: completed,
      })}
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
        onClick={handlerRemove}
      >
        ×
      </button>


      <div className={classNames(
        'modal overlay',
        {
          'is-active': todosTransform.includes(id)
        },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
