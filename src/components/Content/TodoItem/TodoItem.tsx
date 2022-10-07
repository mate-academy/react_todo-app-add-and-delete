import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo;
  isProcessed: number[];
  onUpdateTodo: (todoId: number, data: {}) => void;
  onDeleteTodo: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  onUpdateTodo,
  onDeleteTodo,
}) => {
  const { id, title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          disabled={isProcessed.includes(id)}
          onClick={() => onUpdateTodo(id, { completed: !completed })}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onDeleteTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': id === 0 || isProcessed.includes(id) },
        )}
      >
        <div
          className="
            modal-background
            has-background-white-ter"
        />

        <div className="loader" />
      </div>
    </div>
  );
};
