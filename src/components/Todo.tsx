import { FC, memo } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  isDeleting: number[],
  onDelete: (id: number) => void,
}

export const TodoComponent: FC<Props> = memo(
  ({
    todo,
    isDeleting,
    onDelete,
  }) => {
    const {
      title,
      id,
      completed,
    } = todo;

    return (
      <div
        data-cy="Todo"
        className={cn('todo', { completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            defaultChecked
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => onDelete(id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={cn(
            'modal overlay',
            { 'is-active': isDeleting.includes(id) },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
