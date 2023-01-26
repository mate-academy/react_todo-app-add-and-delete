import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todoList: Todo,
  isTodoLoading: boolean,
  hendleRemoveTodo: (id: number) => void,
  isTodoRemove: boolean,
};

export const TodoInfo: React.FC<Props> = React.memo(({
  todoList,
  isTodoLoading,
  hendleRemoveTodo,
  isTodoRemove,
}) => {
  const { title, completed, id } = todoList;
  // console.log(tempTodo)

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
          onClick={() => hendleRemoveTodo(id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames(
            'modal',
            'overlay',
            { 'is-active': isTodoLoading || isTodoRemove },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
});
