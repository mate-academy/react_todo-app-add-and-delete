import { useState } from 'react';
import { Todo } from '../../types/Todo';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  todo: Todo;
  temporaryTodo?: Todo;
  onDeleteTodo: (id: number) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleTodoStatus: (id: number) => void;
};

export const TodoItem = ({
  todo: { id, title, completed },
  temporaryTodo,
  onDeleteTodo,
  inputRef,
  onToggleTodoStatus,
}: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await onDeleteTodo(id);
    } finally {
      setIsDeleting(false);
      inputRef.current?.focus();
    }
  };

  return (
    <>
      {/* This is a completed todo */}
      <div data-cy="Todo" className={`todo ${completed ? 'completed' : ''}`}>
        <label className="todo__status-label">
          {id && (
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
              onClick={() => onToggleTodoStatus(id)}
            />
          )}
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>

        {/* Remove button appears only on hover */}
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={`modal overlay ${(temporaryTodo || isDeleting) && 'is-active'}`}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
