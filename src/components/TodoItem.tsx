import { FC, useState } from 'react';
import { Todo } from '../types/Todo';
import React from 'react';

type Props = {
  todo: Todo;
  deleteTodo: (todoId: number) => Promise<boolean>;
  isTemp?: boolean;
  // handleCompleteTodo: (todoId: number) => void;
};

export const TodoItem: FC<Props> = ({
  todo,
  deleteTodo,
  isTemp,
  // handleCompleteTodo,
}) => {
  const [isBeingEdited] = useState<boolean>(false);
  const [isBeingDeleted, setIsBeingDeleted] = useState<boolean>(false);

  const handleClick = () => {
    setIsBeingDeleted(true);

    deleteTodo(todo.id).then(didSucceed => {
      if (!didSucceed) {
        setIsBeingDeleted(false);
      }
    });
  };

  // const handleChange = () => {
  //   handleCompleteTodo(todo.id);
  // };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      {isBeingEdited ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      ) : (
        <>
          {/* eslint-disable-next-line */}
          <label className="todo__status-label" htmlFor="label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              readOnly
              checked={todo.completed}
              // onChange={handleChange}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleClick}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={
              'modal overlay' + (isTemp || isBeingDeleted ? ' is-active' : '')
            }
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
