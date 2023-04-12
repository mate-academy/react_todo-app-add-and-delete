import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  removeTodo: (id: number) => void
  isWaitingForDelte: number
  isDeletingCompleted: boolean
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  isWaitingForDelte,
  isDeletingCompleted,
}) => {
  const { title, completed } = todo;

  const handlerOnDelete = (id: number) => {
    removeTodo(id);
  };

  return (
    <div className={classNames(
      'todo',
      { completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handlerOnDelete(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames(
        'modal overlay',
        {
          'is-active': (todo.id === 0
            || isWaitingForDelte === todo.id
            || (isDeletingCompleted && todo.completed)),
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
