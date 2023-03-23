import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';

type TodoProps = {
  todo: Todo;
  isAddingProceeding?: boolean;
  onDelete: (id: number) => void;
};

export const TodoItem: React.FC<TodoProps> = ({
  todo,
  isAddingProceeding,
  onDelete,
}) => {
  const [loading, setIsLoading] = useState(false);
  const { title, completed, id } = todo;

  const handleTodoDeleting = async () => {
    setIsLoading(true);

    await onDelete(id);

    setIsLoading(false);
  };

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

      <button
        type="button"
        className="todo__remove"
        onClick={handleTodoDeleting}
      >
        ×
      </button>
      <div
        className={cn(
          'modal',
          'overlay',
          {
            'is-active': isAddingProceeding || loading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
