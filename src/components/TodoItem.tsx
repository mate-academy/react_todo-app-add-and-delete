import { Todo } from '../types/Todo';
import React, { useState } from 'react';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  handleDeleteTodo: (todoToDelete: Todo) => void;
  loading?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  loading = false,
}) => {
  const [isLoading, setIsLoading] = useState(loading);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {isLoading && (
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', 'is-active')}
        >
          <div className="modal-background" />
          <div className="loader" />
        </div>
      )}

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          handleDeleteTodo(todo);
          setIsLoading(true);
        }}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
