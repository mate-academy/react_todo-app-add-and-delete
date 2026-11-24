/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo as TodoType } from '../../types/Todo';
import classNames from 'classnames';

export const Todo = ({
  todo,
  isLoading,
  removeTodo,
}: {
  todo: TodoType;
  isLoading: boolean;
  removeTodo: (todoId: number) => Promise<boolean>;
}) => (
  <div
    data-cy="Todo"
    className={classNames('todo', {
      completed: todo.completed,
    })}
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        readOnly
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>
    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      disabled={isLoading}
      onClick={() => void removeTodo(todo.id)}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
