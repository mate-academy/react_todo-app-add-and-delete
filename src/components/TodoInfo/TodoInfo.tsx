import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  deleteTodoHandler: (todoId: number) => void,
  deletedTodosIds: number[],
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  deleteTodoHandler,
  deletedTodosIds,
}) => {
  const { id, title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => deleteTodoHandler(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': deletedTodosIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
