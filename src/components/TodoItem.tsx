/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo | null;
  onDelete?: (idToDelete: number) => void;
  deletingTodoIds?: number[];
  tempTodo?: Todo | null;
  isProcessed?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  deletingTodoIds,
  tempTodo,
}) => {
  const [edetingId, setEditingId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (edetingId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [edetingId]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo?.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
        />
      </label>

      {edetingId === todo?.id ? (
        <form>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={todo.title}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => todo && setEditingId(todo.id)}
          >
            {todo?.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => todo && onDelete(todo.id)}
          >
            ×
          </button>
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active':
                (todo && deletingTodoIds?.includes(todo.id)) ||
                (tempTodo && tempTodo.id === todo?.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
