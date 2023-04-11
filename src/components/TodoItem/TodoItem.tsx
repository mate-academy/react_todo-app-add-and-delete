import React, { useState } from 'react';

import classNames from 'classnames';

import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  isActive: boolean,
  // onDelete?: (todoId: number) => void,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isActive,
  // onDelete,
}) => {
  const {
    id,
    completed,
    title,
  } = todo;

  const [isDeleting] = useState(false); // setIsDeleting

  // const handlerRemoveTodo = async () => {
  //   setIsDeleting(true);
  //   // onDelete?.(id);

  //   try {

  //   }
  // };

  return (
    <div
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
      key={id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        // onClick={handlerRemoveTodo}
      >
        ×
      </button>

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': isActive || isDeleting },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
