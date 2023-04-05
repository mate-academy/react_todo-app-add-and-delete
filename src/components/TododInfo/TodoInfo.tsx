import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  handleRemoveTodo: (id: number) => void;
  deletedTodoIds: number[]
};

export const TodoInfo: React.FC<Props> = React.memo(
  ({
    todo,
    handleRemoveTodo,
    deletedTodoIds,
  }) => {
    const isInDeleteList = deletedTodoIds.some(id => todo.id === id);

    return (
      <div
        className={classNames('todo', { completed: todo.completed })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked
          />
        </label>

        <span className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          onClick={() => handleRemoveTodo(todo.id)}
        >
          ×
        </button>

        <div className={classNames(
          'modal overlay',
          { 'is-active': isInDeleteList },
        )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
