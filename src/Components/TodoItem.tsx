/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Prop {
  todo: Todo;
  handleToggle: (id: number) => void;
  handleDelete: (id: number) => void;
  tempTodo: boolean;
  isDelete: boolean;
}

export const TodoItem: React.FC<Prop> = ({
  todo,
  handleToggle,
  handleDelete,
  tempTodo,
  isDelete,
}) => {
  const { title, completed, id } = todo;

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames('todo', {
          completed: completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={() => handleToggle(id)}
            disabled={tempTodo}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          id={
            todo.id !== undefined && todo.id !== null ? todo.id.toString() : ''
          }
          onClick={() => handleDelete(todo.id)}
          disabled={tempTodo}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', {
            'is-active': tempTodo || isDelete,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
