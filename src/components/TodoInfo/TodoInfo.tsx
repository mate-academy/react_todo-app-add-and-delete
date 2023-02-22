import React from 'react';

import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  handleDelete: (todoId: number) => void,
  deletedTodoId: number,
};

export const TodoInfo: React.FC<Props> = React.memo(({
  todo,
  handleDelete,
  deletedTodoId,
}) => {
  const { title, completed } = todo;

  return (
    <div className={classNames(
      'todo',
      { completed: todo.completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDelete(todo.id)}
      >
        ×
      </button>
      {/* <form>
        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value="Todo is being edited now"
        />
      </form> */}

      <div className={classNames(
        'modal',
        'overlay',
        {
          'is-active': deletedTodoId === todo.id,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
