import React, { memo } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

export type Props = {
  todo: Todo
  deleteTodoFromData: (value: number) => void
  deleteTodoIdFromArray: number[]
};

export const TodoItem: React.FC<Props> = memo(({
  todo,
  deleteTodoFromData,
  deleteTodoIdFromArray,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo',
        { completed: todo.completed === true })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => deleteTodoFromData(todo.id)}
      >
        ×
      </button>
      {deleteTodoIdFromArray.includes(todo.id) && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
});
