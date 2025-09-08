/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

export type Props = {
  todo: Todo;
  filterTodos: (value: Todo[] | ((prev: Todo[]) => Todo[])) => void;
  handleDelete: (todoId: number) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  filterTodos,
  handleDelete,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() =>
            filterTodos((prev: Todo[]) => {
              return prev.map(t =>
                t.id === todo.id ? { ...t, completed: !t.completed } : t,
              );
            })
          }
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
