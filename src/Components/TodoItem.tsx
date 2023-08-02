import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  completedIds: number[],
  handleDelete:(todoId: number) => void,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  completedIds,
  handleDelete,
}) => {
  return (
    <div
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDelete(todo.id)}
      >
        х
      </button>

      {false && (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      <div className={
        classNames('modal overlay', {
          'is-active':
            todo.id === 0
            || completedIds.includes(todo.id),
        })
      }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
