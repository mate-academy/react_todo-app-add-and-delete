/* eslint-disable jsx-a11y/label-has-associated-control */
import type { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (id: number) => void;
};

export const TodoItem = ({ todo, isLoading, onDelete }: Props) => {
  const loaderBackgroundClass = 'modal-background has-background-white-ter';

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className={loaderBackgroundClass} />
        <div className="loader" />
      </div>
    </div>
  );
};
