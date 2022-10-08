/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { FormEvent, useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  todoId:number[];
  statusPatch: string;
  setStatusPatch: (event: string) => void;
  handleDeleteTodo: (event: FormEvent, element: number) => void;
  isAdding: boolean;
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  todoId,
  statusPatch,
  setStatusPatch,
  handleDeleteTodo,
  isAdding,
}) => {
  const { id, completed, title } = todo;

  const handlePatch = (event: { target: { value: string; }; }) => {
    setStatusPatch(event.target.value);
  };

  const statusLoader = todoId.includes(todo.id) && isAdding;

  const [completedTodo, setCompletedTodo] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { 'todo completed': completed },
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
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={(event) => handleDeleteTodo(event, id)}
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
            value={title}
            onClick={() => handlePatch}
          />
        </form>
      )}
      {statusLoader
      && (
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
      )}
    </div>
  );
};
