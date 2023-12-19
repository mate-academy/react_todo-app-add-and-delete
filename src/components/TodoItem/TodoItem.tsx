import React, { useState, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: (arg: number) => void;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, onDelete, isLoading }) => {
  const { id, title, completed } = todo;
  const [isEditable, setIsEditable] = useState(false);
  const [value, setValue] = useState(title);
  const inputEditRef = useRef<HTMLInputElement | null>(null);

  const handeleClickOnTitle = () => {
    setIsEditable(true);

    setTimeout(() => {
      inputEditRef.current?.focus();
    }, 0);
  };

  const handleOnClick = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo', { completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            defaultChecked={completed}
          />
        </label>

        {isEditable ? (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={value}
              onChange={e => setValue(e.target.value)}
              onBlur={() => setIsEditable(false)}
              ref={inputEditRef}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handeleClickOnTitle}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleOnClick}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', { 'is-active': isLoading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
