import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
}

export const TodoInfo: React.FC<Props> = (props) => {
  const {
    todo,
  } = props;

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames(
          { todo: true },
          { completed: todo.completed },
        )}
        // key={todo.id}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
        >
          ×
        </button>

        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
