import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  handleDeleteTodo: (id: number) => void;
  isLoading: boolean;
  key: number;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  isLoading,
}) => {
  const [beingRemoved, setBeingRemoved] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>
      {/* eslint-enable jsx-a11y/label-has-associated-control */}

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          handleDeleteTodo(todo.id);
          setBeingRemoved(true);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${(isLoading || beingRemoved) && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
