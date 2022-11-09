import { FC, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo?: (todoId: number) => Promise<void>;
  isAdding?: boolean;
  deleteCompleted?: boolean;
};

export const TodoInfo: FC<Props> = ({
  todo,
  deleteTodo,
  isAdding,
  deleteCompleted,
}) => {
  const { id, title, completed } = todo;
  const [isDeleting, setIsDeleting] = useState(false);
  const isLoading = isAdding
    || isDeleting
    || (deleteCompleted && completed);

  const handleDelete = () => {
    if (deleteTodo) {
      deleteTodo(id);
      setIsDeleting(true);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        {
          completed,
        },
      )}
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
        onClick={handleDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
