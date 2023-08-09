import { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isLoading: boolean,
  removeTodo: (id: number) => void
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  removeTodo,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const [isEditing, setIsEditing] = useState(false);

  return (
    <li
      className={cn(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>
      {!isEditing
        ? (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => removeTodo(id)}
            >
              ×
            </button>
          </>
        )
        : (
          <form>
            <input
              type="text"
              className="todo__title-field"
              value={title}
              onBlur={() => setIsEditing(false)}
            />
          </form>
        )}

      <div
        className={cn(
          'modal',
          'overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
