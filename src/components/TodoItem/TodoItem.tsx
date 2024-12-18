/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Dispatch, SetStateAction, RefObject } from 'react';
import { Todo } from '../../types/Todo';
import cN from 'classnames';

type Props = {
  todo: Todo;
  isTemp?: boolean;
  handleTodoStatusChange?: (id: number) => void;
  onDelete?: (id: number) => Promise<void>;
  isDeletingTodo?: boolean;
  todoToDeleteIds?: number[] | null;
  setTodoToDeleteIds?: Dispatch<SetStateAction<number[] | null>>;
  addTodoField?: RefObject<HTMLInputElement>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isTemp = false,
  handleTodoStatusChange,
  onDelete,
  isDeletingTodo,
  todoToDeleteIds,
  setTodoToDeleteIds,
  addTodoField,
}) => {
  const { title, id, completed } = todo;

  return (
    <div key={id} data-cy="Todo" className={cN('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => (isTemp ? null : handleTodoStatusChange?.(id))}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        onClick={() => {
          setTodoToDeleteIds?.([id]);
          onDelete?.(id).then(() => {
            if (addTodoField?.current !== null) {
              addTodoField?.current.focus();
            }
          });
        }}
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>
      {/* isDeletingTodo спробувати прибрати*/}
      <div
        data-cy="TodoLoader"
        className={cN('modal overlay', {
          'is-active':
            isTemp || (isDeletingTodo && todoToDeleteIds?.includes(id)),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
