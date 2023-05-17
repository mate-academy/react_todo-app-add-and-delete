import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  tempTodo: Todo;
  todoId: number | null;
}

export const TempTodo: FC<Props> = ({
  tempTodo,
  todoId,
}) => {
  const {
    title,
    completed,
    id,
  } = tempTodo;

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
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>
      {/* Remove button appears only on hover */}
      <button type="button" className="todo__remove">×</button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        className={cn('modal overlay', {
          'is-active': todoId === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
