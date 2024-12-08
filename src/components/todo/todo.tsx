/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */

import cn from 'classnames';
import { TodoInterface } from '../../types/Todo';
import { useEffect, useRef, useState } from 'react';

interface Props {
  todo: TodoInterface;
  deleteTodos: (content: number[]) => Promise<void>;

  setTodosForDelete: React.Dispatch<React.SetStateAction<number[]>>;
  todosForDelete: number[];
}

export const Todo: React.FC<Props> = ({
  todo,
  deleteTodos,
  setTodosForDelete,
  todosForDelete,
}) => {
  const [value, setValue] = useState(todo.title);
  const [canEdit, setCanEdit] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { title, completed, id } = todo;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleDoubleClick = () => {
    setCanEdit(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const content = e.target.value;

    setValue(content.trim());
  };

  const handledeleteTodo = () => {
    setTodosForDelete(prev => [...prev, id]);
  };

  useEffect(() => {
    if (todosForDelete.length > 0) {
      deleteTodos(todosForDelete);
    }
  }, [todosForDelete, deleteTodos]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', 'item-enter-done', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={handleDoubleClick}
      >
        {canEdit ? (
          <form>
            <input
              ref={inputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={value}
              onBlur={() => {
                setCanEdit(false);
              }}
              onChange={handleChange}
            />
          </form>
        ) : (
          title
        )}
      </span>

      {!canEdit && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handledeleteTodo}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todosForDelete.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
