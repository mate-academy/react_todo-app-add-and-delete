import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  tempTodo: Todo,
}

export const TempTodoInfo: FC<Props> = ({
  tempTodo,
}) => {
  const { completed, title } = tempTodo;

  return (
    <div
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span
        className="todo__title"
      >
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
      >
        ×
      </button>

      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
