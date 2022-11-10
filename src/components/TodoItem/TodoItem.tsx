import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  isAdding: boolean,
  todosIdsForDelete: number[],
  deleteTodoFromServer: (todoId: number) => void,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  todosIdsForDelete,
  deleteTodoFromServer,
}) => {
  const { id, title, completed } = todo;

  const isLoading = useMemo(() => (
    todosIdsForDelete.includes(id) || (isAdding)
  ), []);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
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
        onClick={() => deleteTodoFromServer(id)}
      >
        ×
      </button>

      {isLoading && (
        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />

          <div className="loader" />
        </div>
      )}
    </div>
  );
};
