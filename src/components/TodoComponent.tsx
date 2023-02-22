import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onDelete?: (id: number) => void,
};

export const TodoComponent: React.FC<Props> = ({ todo, onDelete }) => {
  const { title, completed, id } = todo;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTodoDelete = async () => {
    if (onDelete) {
      setIsLoading(true);

      await onDelete(id);
    }
  };

  return (
    <div
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleTodoDelete}
      >
        ×
      </button>

      {
        (isLoading || id === 0) && (
          <div className="modal overlay" style={{ display: 'flex' }}>
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )
      }
    </div>
  );
};
