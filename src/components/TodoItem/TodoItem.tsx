import { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  handleDelete: (todoId: number) => void;
  isLoading?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDelete,
  isLoading = false,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    setIsDeleting(true);

    await handleDelete(todo.id);

    setIsDeleting(false);
  };

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
      style={{ position: 'relative' }}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        style={{ position: 'absolute' }}
        onClick={onDelete}
        disabled={isLoading}
      >
        ×
      </button>

      <div
        className={cn('modal overlay', {
          'is-active': isLoading || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
