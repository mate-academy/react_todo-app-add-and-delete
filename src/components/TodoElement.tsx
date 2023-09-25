import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContext } from '../Context/TodoContext';

type Props = {
  todo: Todo,
};

export const TodoElement: React.FC<Props> = ({ todo }) => {
  const { completed, title, id } = todo;
  const {
    deleteTodoHandler,
    todosIdToDelete,
  } = useContext(TodoContext);
  const [isChecked, setIsChecked] = useState(completed);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: isChecked },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isChecked}
          onChange={(event) => {
            setIsChecked(event.target.checked);
          }}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          deleteTodoHandler(id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': id === 0 || todosIdToDelete.includes(id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
