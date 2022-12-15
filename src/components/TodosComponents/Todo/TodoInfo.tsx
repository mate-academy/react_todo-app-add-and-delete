/* eslint-disable @typescript-eslint/no-unused-vars */
import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../../types/Todo';

type Props = {
  todos: Todo,
  isAdding?: boolean,
  todoCurrentId?: number,
  DeletingTodo?: (id: number) => void,
  onTodoCurrentId?: (currId: number) => void,
  idsForLoader: number[],
};

export const TodoInfo: React.FC<Props> = ({
  todos,
  isAdding,
  DeletingTodo,
  todoCurrentId,
  onTodoCurrentId,
  idsForLoader,
}) => {
  const { title, id } = todos;

  const [isDeliting, setIsDeliting] = useState(false);

  const handlerDeleteButton = async () => {
    if (DeletingTodo) {
      setIsDeliting(true);

      await DeletingTodo(id);

      setIsDeliting(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className="todo"
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handlerDeleteButton}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': isAdding || isDeliting || idsForLoader.includes(id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
