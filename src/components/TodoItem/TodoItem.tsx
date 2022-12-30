import classNames from 'classnames';
import React from 'react';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  setShowError: (val: Errors) => void
  targetTodoId: number | null,
  setTargetTodoId: (todoId: number) => void,
  completedDelete: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setShowError,
  targetTodoId,
  setTargetTodoId,
  completedDelete,
}) => {
  const clickToDelete = (todoId: number) => {
    setTargetTodoId(todoId);
  };

  const addClass = todo.id === targetTodoId
    || (todo.completed && completedDelete);

  return (
    <div
      data-cy="Todo"
      className={todo.completed ? 'todo completed' : 'todo'}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={() => setShowError(Errors.Update)}
      >
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => clickToDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={
          classNames('modal overlay', {
            'is-active': addClass,
          })
        }
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
