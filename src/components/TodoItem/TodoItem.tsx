/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: (todoId: number) => void;
  onloadingTodoIds?: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onloadingTodoIds = [],
  onDelete = () => {},
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo ', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          checked={todo.completed}
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
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay ', {
          'is-active': onloadingTodoIds.includes(todo.id) || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
