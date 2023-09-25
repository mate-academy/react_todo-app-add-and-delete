import { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  processingIds: number[];
  onDelete: (id: number) => void;
};

export const TodoItem: React.FC<Props> = (
  { todo, processingIds, onDelete },
) => {
  const { id, title, completed } = todo;
  const [checked, setChecked] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEditing = () => {
    setIsEditing(true);
  };

  const handleChecked = () => {
    setChecked(currentChecked => !currentChecked);
  };

  return (
    <li
      className={cn(
        'todo',
        {
          completed,
          editing: isEditing,
        },
      )}
    >
      <label
        className="todo__status-label"
        onDoubleClick={handleEditing}
        htmlFor={`toggle-view-${id}`}
      >
        <input
          type="checkbox"
          className="todo__status"
          id={`toggle-view-${id}`}
          checked={checked}
          onClick={handleChecked}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        aria-label="Delete Todo"
        onClick={() => onDelete(id)}
      >
        x
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': processingIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
