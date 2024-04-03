import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo?: Partial<Todo>;
  tempTodo?: Partial<Todo>;
  onDelete?: (id: number) => void;
  isLoading: boolean;
  deletedTodo?: Todo[] | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  tempTodo,
  onDelete = () => {},
  isLoading,
  deletedTodo,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo?.completed })}
      key={todo && todo.id}
    >
      <label className="todo__status-label">
        {''}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo ? tempTodo?.title : todo?.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          if (todo && todo.id !== undefined) {
            onDelete(todo.id);
          }
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            (isLoading && tempTodo) ||
            (isLoading &&
              deletedTodo &&
              todo &&
              deletedTodo.some(deleted => deleted.id === todo.id)),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
