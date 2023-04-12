import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (value: number) => void;
  isIncludes: boolean;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  isIncludes,
}) => {
  const { title, id } = todo;

  return (
    <>
      <div
        className={classNames('todo', {
          completed: todo.completed,
        })}
        key={todo.id}
      >
        <label className="todo__status-label">
          <input type="checkbox" className="todo__status" />
        </label>

        {/* <form>
        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value="Todo is being edited now"
        />
      </form> */}

        <span className="todo__title">{title}</span>
        <button
          type="button"
          className="todo__remove"
          onClick={() => onDelete(id)}
        >
          ×
        </button>

        {isIncludes && (
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    </>
  );
};
