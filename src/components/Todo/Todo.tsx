import { useState } from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../../types/Todo';

interface Props {
  todo: TodoType,
  onDelete: (id: number) => void,
}

export const Todo: React.FC<Props> = ({ todo, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await onDelete(todo.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo',
        {
          'todo completed': todo.completed,
        })}
    >
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
        onClick={handleDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          { 'is-active': isLoading || todo.id === 0 },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
