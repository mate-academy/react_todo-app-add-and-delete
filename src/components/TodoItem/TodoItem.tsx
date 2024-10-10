import React from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  updateTodo: (updatedTodo: Todo) => void;
  deleteTodo: (todoId: number) => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  updateTodo,
  deleteTodo,
  isLoading,
}) => {
  const { title, completed, id } = todo;
  const todoId = `${id}`;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label" htmlFor={todoId}>
        <input
          id={todoId}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => updateTodo({ ...todo, completed: !completed })}
          defaultChecked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
