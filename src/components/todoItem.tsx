import classNames from 'classnames';
import { Todo } from '../types/Todo';

type TodoItemProps = {
  todo: Todo;
  loader?: boolean;
  onDelete: (id: number) => void;
};

export function TodoItem({ todo, loader = false, onDelete }: TodoItemProps) {
  const todoId = `todo-status-${todo.id}`;

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo is-active', {
        'todo completed': todo.completed,
      })}
    >
      <label className="todo__status-label" htmlFor={todoId}>
        <input
          id={todoId}
          aria-label="Toggle todo completion"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
}
