import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  deleteTodo: (todoId: number) => void;
  todo: Todo;
  isActive: number | undefined;
  isLoading: boolean;
  deletingTodoId: number | null;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed },
  isActive,
  isLoading,
  deleteTodo,
  deletingTodoId,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
      key={id}
    >
      <label
        className="todo__status-label"
        htmlFor={`todo-${id}`}
        aria-label="Toggle todo status"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {}}
          id={`todo-${id}`}
        />
      </label>

      {id === isActive ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onClick={() => {}}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': (isLoading && id === 0) || deletingTodoId === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
