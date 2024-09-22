/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (todo: number) => void;
  activeTodoId: number | null;
};

export const TodoItem: React.FC<Props> = ({ todo, onDelete, activeTodoId }) => {
  const { id, completed, title } = todo;

  return (
    <div
      data-cy="Todo"
      key={id}
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label" htmlFor={`todo-checkbox-${id}`}>
        <input
          id={`todo-checkbox-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {title}
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
        className={classNames('modal overlay', {
          'is-active': todo.id === activeTodoId,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
