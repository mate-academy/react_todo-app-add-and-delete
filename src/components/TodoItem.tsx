import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onCompletedChange?: (todoId: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onCompletedChange = () => {},
}) => {
  const checkHandler = (event: React.FormEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onCompletedChange(todo.id);
  };

  return (
    <div
      className={classNames('todo',
        { completed: todo.completed })}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={checkHandler}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {todo.title}
      </span>
      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        // onClick={}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className="modal overlay"
      >
        <div
          className="modal-background
           has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
