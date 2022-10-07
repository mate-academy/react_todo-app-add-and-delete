import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (todoId: number) => void;
  isLoading: boolean;
  selectedId: number | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  isLoading,
  selectedId,
}) => {
  const selected = todo.id === selectedId;

  return (
    <div
      data-cy="Todo"
      className="todo"
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
        onClick={() => removeTodo(todo.id)}
      >
        ×
      </button>

      {
        selected && (
          <div
            data-cy="TodoLoader"
            className={classNames(
              'modal overlay',
              { 'is-active': isLoading },
            )}
          >
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        )
      }
    </div>
  );
};
