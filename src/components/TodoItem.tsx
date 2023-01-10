import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isInputSelected: boolean;
  onTodoDelete: (todoIds: number[]) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue: string;
  isActive: boolean;
  onInputBlur: () => void;
  onDoubleClick: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    todoId: number,
  ) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, completed, title },
  isInputSelected,
  onTodoDelete,
  onInputChange,
  inputValue,
  onDoubleClick,
  isActive,
  onInputBlur,
}) => {
  const selectedTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedTodoField.current) {
      selectedTodoField.current.focus();
    }
  });

  return (
    <li
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>
      {isInputSelected ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={selectedTodoField}
            value={inputValue}
            onChange={onInputChange}
            onBlur={onInputBlur}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={(event) => onDoubleClick(event, id)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => onTodoDelete([id])}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': isActive },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
