import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todoList: Todo,
  onDelete: (id: number) => void,
  deletedTodosId: number[],
  isTodoLoading: boolean,
  activeTodoId: number[]
};

export const TodoInfo: React.FC<Props> = React.memo(({
  todoList,
  onDelete,
  deletedTodosId,
  isTodoLoading,
  activeTodoId,
}) => {
  const { title, completed, id } = todoList;
  const isSpinerActive = deletedTodosId.includes(id)
  || activeTodoId.includes(id);

  console.log(isTodoLoading);

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames(
          'todo',
          { completed },
        )}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">{title}</span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => onDelete(id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames(
            'modal',
            'overlay',
            { 'is-active': isSpinerActive },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
});
