import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
}

export const TempTodo: React.FC<Props> = ({ todo }) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo temp-todo', {
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className="modal overlay is-active"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
