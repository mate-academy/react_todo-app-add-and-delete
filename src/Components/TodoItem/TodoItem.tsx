import { FC, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isDeleting: (id: number) => void;
  areAllRemoving: boolean;
};

export const TodoItem: FC<Props> = ({
  todo,
  isDeleting,
  areAllRemoving,
}) => {
  const { id, completed, title } = todo;
  const [isRemoving, setIsRemoving] = useState(false);
  const isLoading = id === 0
    || isRemoving
    || (completed && areAllRemoving);

  const handleTodoRemove = async () => {
    try {
      setIsRemoving(true);
      await isDeleting(id);
      setTimeout(() => setIsRemoving(false), 3000);
    } catch (error) {
      // setError(ErrorType.Delete);
    }
  };

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleTodoRemove}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
