/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  statusPatch: string;
  setStatusPatch: (event: string) => void;
  handleClickDelete: (event: number) => void;
  isAdding: boolean;
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  statusPatch,
  setStatusPatch,
  handleClickDelete,
  isAdding,
}) => {
  const handlePatch = (event: { target: { value: string; }; }) => {
    setStatusPatch(event.target.value);
  };

  const [completedTodo, setCompletedTodo] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { 'todo completed': completedTodo },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completedTodo}
          onChange={() => {
            setCompletedTodo(!completedTodo);
          }}
        />
      </label>
      {!statusPatch ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handleClickDelete(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todo.title}
            onClick={() => handlePatch}
          />
        </form>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': isAdding,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
