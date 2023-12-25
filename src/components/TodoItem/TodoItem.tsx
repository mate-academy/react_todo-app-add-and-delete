import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { EditField } from '../../types/types';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: (arg: number) => void;
  onEdit?: (id: number, arg: EditField) => void;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onEdit,
  isLoading,
}) => {
  const { id, title, completed } = todo;
  const [isEditable, setIsEditable] = useState(false);
  const [value, setValue] = useState(title);
  const inputEditRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputEditRef.current) {
      inputEditRef.current.focus();
    }
  }, [isEditable]);

  const handleClickOnTitle = () => {
    setIsEditable(true);
  };

  const handleOnSubmit = () => {
    const arg = {
      title: value,
    };

    if (onEdit) {
      onEdit(id, arg);
    }
  };

  const handleCheck = () => {
    const arg = {
      completed: !completed,
    };

    if (onEdit) {
      onEdit(id, arg);
    }
  };

  const handleOnClick = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
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
          onChange={handleCheck}
        />
      </label>

      {isEditable ? (
        <form onSubmit={handleOnSubmit}>
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
            onDoubleClick={handleClickOnTitle}
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
  );
};
