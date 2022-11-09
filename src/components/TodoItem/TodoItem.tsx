import React, { useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (todoId: number) => void;
  isDeletingCompleted: boolean;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  removeTodo,
  isDeletingCompleted,
}) => {
  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
  const { title, completed, id } = todo;

  const handleDelete = () => {
    setDeleteButtonClicked(true);
    removeTodo(id);
  };

  // const loaderIsActive = () => {
  //   if (id === 0 || deleteButtonClicked) {
  //     return true;
  //   }

  //   if (isDeletingCompleted && completed) {
  //     return true;
  //   }

  //   return false;
  // };

  const loaderIsActive = (id === 0 || deleteButtonClicked)
    || (isDeletingCompleted && completed);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          { 'is-active': loaderIsActive })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
