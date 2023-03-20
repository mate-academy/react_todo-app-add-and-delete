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
  const [isDeleting, setIsDeleting] = useState(false);
  const { title, completed, id } = todo;

  const handleTodoDeleting = async () => {
    setIsDeleting(true);

    await onDelete(id);

    setIsDeleting(false);
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
            'is-active': isAddingProceeding || isDeleting,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
