import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo | null;
  onDelete: (todoId: number) => void;
  idsToDelete: number[];
};

export const TodoElement = ({ todo, onDelete, idsToDelete }: Props) => {
  if (!todo) {
    return null;
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo temp-item-enter-active', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
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
        onClick={() => {
          onDelete(todo.id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': idsToDelete.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
