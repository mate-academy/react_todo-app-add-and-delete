/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { useState } from 'react';

type Props = {
  todo: Todo;
  onDelete: (postId: number) => Promise<unknown>;
  todosInProcess: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo: { completed, title, id },
  onDelete,
  todosInProcess,
}) => {
  const [isChecked, setIsChecked] = useState(completed);

  const isInProcess = todosInProcess.includes(id);

  const handleChangeChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: isChecked })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isChecked}
          onChange={handleChangeChecked}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isInProcess,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
