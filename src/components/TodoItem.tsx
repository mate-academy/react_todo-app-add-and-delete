/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => void;
  onToggleStatus: (id: number) => void;
  loadingTodoId: number | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onToggleStatus,
  loadingTodoId,
}) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames([
        'todo',
        {
          completed: todo.completed,
        },
      ])}
    >
      <label htmlFor={`todo-status-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggleStatus(todo.id)}
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
        className={classNames([
          'modal',
          'overlay',
          {
            'is-active': loadingTodoId === todo.id,
          },
        ])}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
