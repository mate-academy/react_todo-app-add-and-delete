import classNames from 'classnames';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo;
  handleDelete: (todoId: number) => void
};

export const TodoInfo: React.FC<Props> = ({ todo, handleDelete }) => {
  const {
    id,
    title,
    completed,
  } = todo;

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames(
          'todo',
          {
            completed,
          },
        )}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">{title}</span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => handleDelete(id)}
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
